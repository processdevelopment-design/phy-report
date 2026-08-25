import { supabase } from '../lib/supabase';
import type { TransactionFilters, TransactionRecord, TransactionSummary } from '../types/transaction';

function toRpcParams(filters: TransactionFilters) {
  return {
    p_start_date: filters.startDate ?? null,
    p_end_date: filters.endDate ?? null,
    p_branch: filters.branch && filters.branch !== 'all' ? filters.branch : null,
    p_payment_info:
      filters.paymentInfo && filters.paymentInfo.length > 0 ? filters.paymentInfo : null,
  };
}

export const transactionService = {
  async getTransactions(
    filters: TransactionFilters,
    page: number,
    pageSize: number,
  ): Promise<TransactionRecord[]> {
    const { data, error } = await supabase.rpc('get_sales_report', {
      ...toRpcParams(filters),
      p_limit: pageSize,
      p_offset: page * pageSize,
    });
    if (error) throw error;
    return (data ?? []) as TransactionRecord[];
  },

  async getSummary(filters: TransactionFilters): Promise<TransactionSummary> {
    const { data, error } = await supabase.rpc('get_sales_report_summary', toRpcParams(filters));
    if (error) throw error;
    const row = data?.[0];
    return {
      count: Number(row?.total_count ?? 0),
      totalAmount: Number(row?.total_amount ?? 0),
    };
  },

  /** Fetches every matching row in batches for CSV export -- never limited to the on-screen page. */
  async getAllTransactionsForExport(
    filters: TransactionFilters,
    batchSize: number,
  ): Promise<TransactionRecord[]> {
    const all: TransactionRecord[] = [];
    let page = 0;
    for (;;) {
      const batch = await this.getTransactions(filters, page, batchSize);
      all.push(...batch);
      if (batch.length < batchSize) break;
      page += 1;
    }
    return all;
  },

  async getBranchOptions(): Promise<string[]> {
    const { data, error } = await supabase
      .from('branches')
      .select('name')
      .eq('is_active', true)
      .order('name');
    if (error) throw error;
    return (data ?? []).map((row) => row.name as string).filter(Boolean);
  },

  async getPaymentInfoOptions(): Promise<string[]> {
    const { data, error } = await supabase.rpc('get_sales_report_payment_info_options');
    if (error) throw error;
    return (data ?? []).map((row: { payment_info: string }) => row.payment_info).filter(Boolean);
  },
};

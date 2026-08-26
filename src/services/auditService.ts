import { supabase } from '../lib/supabase';
import type { TransactionFilters } from '../types/transaction';

/**
 * Fire-and-forget audit logging. Both calls swallow their own errors so a
 * logging failure (network blip, RPC error, etc.) never blocks or breaks the
 * actual report/export flow -- this table is a background side effect only.
 */
export const auditService = {
  async logAccess(): Promise<void> {
    try {
      await supabase.rpc('log_transaction_report_access');
    } catch (err) {
      console.warn('Audit log (access) failed silently:', err);
    }
  },

  async logDownload(
    filters: TransactionFilters,
    recordCount: number,
    filename: string,
    downloadedColumns: string[],
  ): Promise<void> {
    try {
      await supabase.rpc('log_transaction_report_download', {
        p_start_date: filters.startDate ?? null,
        p_end_date: filters.endDate ?? null,
        p_branch: filters.branch && filters.branch !== 'all' ? filters.branch : null,
        p_payment_info:
          filters.paymentInfo && filters.paymentInfo.length > 0 ? filters.paymentInfo : null,
        p_record_count: recordCount,
        p_download_filename: filename,
        p_downloaded_columns: downloadedColumns,
      });
    } catch (err) {
      console.warn('Audit log (download) failed silently:', err);
    }
  },
};

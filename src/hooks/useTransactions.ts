import { useCallback, useEffect, useState } from 'react';
import { transactionService } from '../services/transactionService';
import { currentMonthRange } from '../utils/date';
import { DEFAULT_PAGE_SIZE, EXPORT_BATCH_SIZE } from '../constants/app';
import type { TransactionFilters, TransactionRecord } from '../types/transaction';

function defaultFilters(): TransactionFilters {
  const { startDate, endDate } = currentMonthRange();
  return { startDate, endDate, branch: 'all', paymentInfo: [] };
}

export function useTransactions() {
  const [filters, setFilters] = useState<TransactionFilters>(defaultFilters());
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [rows, setRows] = useState<TransactionRecord[]>([]);
  const [count, setCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [pageRows, summary] = await Promise.all([
        transactionService.getTransactions(filters, page, pageSize),
        transactionService.getSummary(filters),
      ]);
      setRows(pageRows);
      setCount(summary.count);
      setTotalAmount(summary.totalAmount);
    } catch {
      setError('Unable to load transactions.');
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateFilters = useCallback((next: TransactionFilters) => {
    setFilters(next);
    setPage(0);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters());
    setPage(0);
  }, []);

  const exportCsv = useCallback(async (): Promise<TransactionRecord[] | null> => {
    setExporting(true);
    setExportError(null);
    try {
      return await transactionService.getAllTransactionsForExport(filters, EXPORT_BATCH_SIZE);
    } catch {
      setExportError('Unable to generate the CSV. Please try again.');
      return null;
    } finally {
      setExporting(false);
    }
  }, [filters]);

  return {
    filters,
    updateFilters,
    clearFilters,
    page,
    setPage,
    pageSize,
    setPageSize,
    rows,
    count,
    totalAmount,
    loading,
    error,
    refresh,
    exporting,
    exportError,
    exportCsv,
  };
}

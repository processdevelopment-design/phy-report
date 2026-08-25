import { useCallback } from 'react';
import { AppHeader } from '../components/layout/AppHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { TransactionSummary } from '../components/transactions/TransactionSummary';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { useAuth } from '../hooks/useAuth';
import { useTransactions } from '../hooks/useTransactions';
import { transactionsToCsv, downloadCsv } from '../utils/csv';
import { exportTimestamp } from '../utils/date';

export function TransactionReport() {
  const { profile, signOut } = useAuth();
  const {
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
  } = useTransactions();

  const handleExport = useCallback(async () => {
    const allRows = await exportCsv();
    if (!allRows) return;
    const csv = transactionsToCsv(allRows);
    downloadCsv(`PULSE_Transaction_Report_${exportTimestamp()}.csv`, csv);
  }, [exportCsv]);

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader profile={profile} onSignOut={signOut} />
      <PageContainer>
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-slate-900">Sales Transactions</h1>
          <p className="text-sm text-slate-500">Monitor and download PULSE transaction records.</p>
        </div>

        <div className="space-y-4">
          <TransactionFilters
            filters={filters}
            onApply={updateFilters}
            onClear={clearFilters}
            onExport={handleExport}
            exporting={exporting}
            exportError={exportError}
          />

          <TransactionSummary count={count} totalAmount={totalAmount} />

          <TransactionTable
            rows={rows}
            loading={loading}
            error={error}
            onRetry={refresh}
            page={page}
            pageSize={pageSize}
            count={count}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(0);
            }}
          />
        </div>
      </PageContainer>
    </div>
  );
}

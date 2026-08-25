interface TransactionExportProps {
  exporting: boolean;
  exportError: string | null;
  onDownload: () => void;
}

/** The Download CSV control -- export batching/CSV-building lives in useTransactions + utils/csv. */
export function TransactionExport({ exporting, exportError, onDownload }: TransactionExportProps) {
  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={onDownload}
        disabled={exporting}
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {exporting ? 'Preparing CSV...' : 'Download CSV'}
      </button>
      {exportError && <p className="text-xs text-red-600">{exportError}</p>}
    </div>
  );
}

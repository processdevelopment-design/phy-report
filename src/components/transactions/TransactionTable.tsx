import { TRANSACTION_COLUMNS, PAGE_SIZE_OPTIONS } from '../../constants/app';
import { formatDisplayDate } from '../../utils/date';
import { formatPHP } from '../../utils/currency';
import type { TransactionRecord } from '../../types/transaction';

interface TransactionTableProps {
  rows: TransactionRecord[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  page: number;
  pageSize: number;
  count: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function TransactionTable({
  rows,
  loading,
  error,
  onRetry,
  page,
  pageSize,
  count,
  onPageChange,
  onPageSizeChange,
}: TransactionTableProps) {
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const currentPage = page + 1;

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-800">Transactions</h2>
        <label className="flex items-center gap-2 text-xs text-slate-500">
          Rows per page
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] table-auto border-collapse text-sm">
          <thead className="sticky top-0 bg-slate-50">
            <tr>
              {TRANSACTION_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap border-b border-slate-200 px-3 py-2 text-left font-semibold text-slate-600"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={TRANSACTION_COLUMNS.length} className="px-3 py-8 text-center text-slate-500">
                  Loading transactions...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={TRANSACTION_COLUMNS.length} className="px-3 py-8 text-center">
                  <p className="text-slate-600">{error}</p>
                  <button
                    type="button"
                    onClick={onRetry}
                    className="mt-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Try Again
                  </button>
                </td>
              </tr>
            )}

            {!loading && !error && rows.length === 0 && (
              <tr>
                <td colSpan={TRANSACTION_COLUMNS.length} className="px-3 py-8 text-center text-slate-500">
                  <p className="font-medium text-slate-700">No transactions found</p>
                  <p className="text-sm">Try changing your filters or date range.</p>
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              rows.map((row) => (
                <tr key={row['Invoice Code'] + row['Date'] + row['Treatment/Product']} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="whitespace-nowrap px-3 py-2">{formatDisplayDate(row.Date)}</td>
                  <td className="whitespace-nowrap px-3 py-2">{row.Branch}</td>
                  <td className="whitespace-nowrap px-3 py-2">{row['Invoice Code']}</td>
                  <td className="whitespace-nowrap px-3 py-2">{row['TPN Code']}</td>
                  <td className="whitespace-nowrap px-3 py-2">{row['Patient Code']}</td>
                  <td className="whitespace-nowrap px-3 py-2">{row['Patient Name']}</td>
                  <td className="whitespace-nowrap px-3 py-2">{row['Treatment/Product']}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">{row.Qty}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">{formatPHP(row.Total)}</td>
                  <td className="whitespace-nowrap px-3 py-2">{row['Payment Info']}</td>
                  <td className="whitespace-nowrap px-3 py-2">{row.Doctor}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-3 border-t border-slate-200 px-4 py-3 text-sm">
        <button
          type="button"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-slate-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

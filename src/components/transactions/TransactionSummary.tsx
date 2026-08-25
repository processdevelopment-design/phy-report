import { formatPHP } from '../../utils/currency';

interface TransactionSummaryProps {
  count: number;
  totalAmount: number;
}

export function TransactionSummary({ count, totalAmount }: TransactionSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Transactions
        </div>
        <div className="mt-1 text-2xl font-bold text-slate-900">{count.toLocaleString()}</div>
        <div className="text-xs text-slate-400">matching records</div>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Total Amount
        </div>
        <div className="mt-1 text-2xl font-bold text-slate-900">{formatPHP(totalAmount)}</div>
        <div className="text-xs text-slate-400">filtered transactions</div>
      </div>
    </div>
  );
}

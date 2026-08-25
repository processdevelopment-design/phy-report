import { useEffect, useState } from 'react';
import { transactionService } from '../../services/transactionService';
import { TransactionExport } from './TransactionExport';
import type { TransactionFilters as Filters } from '../../types/transaction';

interface TransactionFiltersProps {
  filters: Filters;
  onApply: (filters: Filters) => void;
  onClear: () => void;
  onExport: () => void;
  exporting: boolean;
  exportError: string | null;
}

export function TransactionFilters({
  filters,
  onApply,
  onClear,
  onExport,
  exporting,
  exportError,
}: TransactionFiltersProps) {
  const [draft, setDraft] = useState(filters);
  const [branchOptions, setBranchOptions] = useState<string[]>([]);
  const [paymentOptions, setPaymentOptions] = useState<string[]>([]);
  const [paymentMenuOpen, setPaymentMenuOpen] = useState(false);

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  useEffect(() => {
    transactionService.getBranchOptions().then(setBranchOptions).catch(() => {});
    transactionService.getPaymentInfoOptions().then(setPaymentOptions).catch(() => {});
  }, []);

  function togglePayment(value: string) {
    const current = draft.paymentInfo ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setDraft({ ...draft, paymentInfo: next });
  }

  const paymentLabel =
    !draft.paymentInfo || draft.paymentInfo.length === 0
      ? 'All Payment Info'
      : `${draft.paymentInfo.length} selected`;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Transaction Filters
      </h2>

      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-slate-700">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={draft.startDate ?? ''}
            onChange={(e) => setDraft({ ...draft, startDate: e.target.value || undefined })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-slate-700">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={draft.endDate ?? ''}
            onChange={(e) => setDraft({ ...draft, endDate: e.target.value || undefined })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="branch" className="block text-sm font-medium text-slate-700">
            Branch
          </label>
          <select
            id="branch"
            value={draft.branch ?? 'all'}
            onChange={(e) => setDraft({ ...draft, branch: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="all">All Branches</option>
            {branchOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <span className="block text-sm font-medium text-slate-700">Payment Info</span>
          <button
            type="button"
            onClick={() => setPaymentMenuOpen((v) => !v)}
            className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 px-3 py-2 text-left text-sm"
            aria-haspopup="listbox"
            aria-expanded={paymentMenuOpen}
          >
            <span>{paymentLabel}</span>
            <span aria-hidden>▾</span>
          </button>
          {paymentMenuOpen && (
            <div className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md border border-slate-200 bg-white p-2 shadow-lg">
              <div className="flex justify-between border-b border-slate-100 pb-1 text-xs">
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setDraft({ ...draft, paymentInfo: [...paymentOptions] })}
                >
                  Select All
                </button>
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setDraft({ ...draft, paymentInfo: [] })}
                >
                  Clear All
                </button>
              </div>
              {paymentOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 py-1 text-sm">
                  <input
                    type="checkbox"
                    checked={(draft.paymentInfo ?? []).includes(option)}
                    onChange={() => togglePayment(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onApply(draft)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Clear Filters
          </button>
        </div>
        <TransactionExport exporting={exporting} exportError={exportError} onDownload={onExport} />
      </div>
    </div>
  );
}

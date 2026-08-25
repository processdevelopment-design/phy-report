import { TRANSACTION_COLUMNS } from '../constants/app';
import { toCsvNumber } from './currency';
import type { TransactionRecord } from '../types/transaction';

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function transactionsToCsv(rows: TransactionRecord[]): string {
  const header = TRANSACTION_COLUMNS.map((c) => escapeCsvField(c.label)).join(',');
  const lines = rows.map((row) =>
    TRANSACTION_COLUMNS.map(({ key }) => {
      const value = row[key];
      const text = key === 'Total' ? toCsvNumber(value as number) : String(value ?? '');
      return escapeCsvField(text);
    }).join(','),
  );
  return [header, ...lines].join('\r\n');
}

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

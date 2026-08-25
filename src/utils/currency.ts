const pesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPHP(amount: number): string {
  return pesoFormatter.format(amount);
}

/** Spreadsheet-friendly plain number for CSV export (no currency symbol/thousands separators). */
export function toCsvNumber(amount: number): string {
  return amount.toFixed(2);
}

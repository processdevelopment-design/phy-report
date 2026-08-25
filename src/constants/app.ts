export const AUTHORIZED_ROLES = ['cashier', 'assistant', 'admin'] as const;

export const PHYSIARE_LOGO_URL = 'https://i.imgur.com/JSNghE3.png';

export const PAGE_SIZE_OPTIONS = [25, 50, 100] as const;

export const DEFAULT_PAGE_SIZE = 25;

export const EXPORT_BATCH_SIZE = 2000;

export const TRANSACTION_COLUMNS = [
  { key: 'Date', label: 'Date' },
  { key: 'Branch', label: 'Branch' },
  { key: 'Invoice Code', label: 'Invoice Code' },
  { key: 'TPN Code', label: 'TPN Code' },
  { key: 'Patient Code', label: 'Patient Code' },
  { key: 'Patient Name', label: 'Patient Name' },
  { key: 'Treatment/Product', label: 'Treatment/Product' },
  { key: 'Qty', label: 'Qty' },
  { key: 'Total', label: 'Total' },
  { key: 'Payment Info', label: 'Payment Info' },
  { key: 'Doctor', label: 'Doctor' },
] as const;

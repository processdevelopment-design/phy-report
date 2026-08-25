export interface TransactionRecord {
  Date: string;
  Branch: string;
  'Invoice Code': string;
  'TPN Code': string;
  'Patient Code': string;
  'Patient Name': string;
  'Treatment/Product': string;
  Qty: number;
  Total: number;
  'Payment Info': string;
  Doctor: string;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  branch?: string;
  paymentInfo?: string[];
}

export interface TransactionSummary {
  count: number;
  totalAmount: number;
}


export interface BillingRecord {
  id: string;
  customerName: string;
  invoiceId: number;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  issueDate: Date;
  year: number;
  month: number;
  productDescription: string;
  productLine: string;
  productGroup: string;
}

export interface Filters {
  customerName: string;
  productLine: string;
  year: string;
  month: string;
}

export type SortConfig = {
  key: keyof BillingRecord;
  direction: 'ascending' | 'descending';
} | null;

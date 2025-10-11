export class Invoice {}


export interface InvoiceDetail {
  invoiceId: number;
  customerName: string;
  date: string;
  items: { description: string; quantity: number; price: number }[];
  total: number;
}
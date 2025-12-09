export class CreateInvoiceDto {
  CustomerId: number;
  InvoiceDate: Date;
  BillingAddress?: string;
  BillingCity?: string;
  BillingState?: string;
  BillingCountry?: string;
  BillingPostalCode?: string;
  Total: number;
}

import { Expose, Type } from 'class-transformer'


export class LineDto {
    @Expose({ name: 'Track.Name' })
    trackName: string;

    @Expose({ name: 'Track.Composer' })
    composer?: string;

    @Expose({ name: 'Track.UnitPrice' })
    unitPrice: number;

    @Expose()
    quantity: number;








}

export class InvoiceWithTracksDto {
    invoiceId: number;
    customerId: number;
    invoiceDate: Date;
    total: number;
    lines: {
        trackName: string;
        composer?: string;
        unitPrice: number;
        quantity: number;
    }[];
}


export class InvoiceWithTracksDtoPrueba {
    @Expose({ name: 'InvoiceId' })
    invoiceId: number;

    @Expose({ name: 'CustomerId' })
    customerId: number;

    @Expose({ name: 'InvoiceDate' })
    invoiceDate: Date;

    @Expose({ name: 'Total' })
    total: number;



    @Expose()
    @Type(() => LineDto)
    InvoiceLine: LineDto[];



}
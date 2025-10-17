import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { prisma } from '@novaCode/resource';
import { plainToInstance } from 'class-transformer';
import { PdfGeneratorServices } from 'src/services/generatePdf.service';
import { PdfOptions } from 'src/services/tableData.interface';
import { promises } from 'dns';

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
@Injectable()
export class InvoiceService {
  constructor(private readonly pdfService: PdfGeneratorServices) { }

  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    const created = await prisma.invoice.create({ data: dto });
    return plainToInstance(Invoice, created);
  }

  async findAll(): Promise<Invoice[]> {
    const invoices = await prisma.invoice.findMany();
    return invoices.map(inv => ({
      ...inv,
      total: inv.Total ?? null,
    })) as Invoice[];
  }

  async findAllWithTracks(): Promise<InvoiceWithTracksDto[]> {
    const invoices = await prisma.invoice.findMany({
      include: {
        InvoiceLine: {
          include: {
            Track: {
              select: {
                Name: true,
                Composer: true,
                UnitPrice: true
              }
            }
          }
        }
      }
    });
    const invoicesDto: InvoiceWithTracksDto[] = invoices.map(inv => ({
      invoiceId: inv.InvoiceId,
      customerId: inv.CustomerId,
      invoiceDate: inv.InvoiceDate,
      total: Number(inv.Total),
      lines: inv.InvoiceLine.map(line => ({
        trackName: line.Track.Name,
        composer: line.Track.Composer ?? undefined,
        unitPrice: Number(line.UnitPrice),
        quantity: line.Quantity
      }))
    }));

    return invoicesDto


  }



  async generatePdf(options: PdfOptions): Promise<Buffer> {
    return this.pdfService.generatePdf(options);
  }
}
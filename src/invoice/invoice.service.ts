import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { PrismaClient } from '@novaCode/resource/prisma/client';
import {PrismaService} from '@novaCode/resource/prisma/services';
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
  constructor(private readonly pdfService: PdfGeneratorServices,
    private readonly prisma : PrismaService
  ) { }

  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    const created = this.prisma.invoice.create({ data: dto });
    return plainToInstance(Invoice, created);
  }
  async findAll(params: { page: number | string; limit: number | string; filter?: string }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;

    const where = params.filter
      ? {
        OR: [
          { BillingCity: { contains: params.filter, mode: 'insensitive' } },
          { BillingCountry: { contains: params.filter, mode: 'insensitive' } },
        ],
      }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.invoice.findMany({
        skip,
        take: limit,
        where,
        orderBy: { InvoiceDate: 'desc' },


      }),
      this.prisma.invoice.count({ where }),


    ]);
    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    }

  }



  async findAllWithTracks(): Promise<InvoiceWithTracksDto[]> {
    const invoices = await this.prisma.invoice.findMany({
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
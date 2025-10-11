import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { prisma } from '@novaCode/resource';
import { plainToInstance } from 'class-transformer';
import { PdfGeneratorServices } from 'src/services/generatePdf.service';
import { PdfOptions } from 'src/services/tableData.interface';

@Injectable()
export class InvoiceService {
  constructor(private readonly pdfService: PdfGeneratorServices) {}

  // Crear una factura en la base de datos
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

 

  async generatePdf(options: PdfOptions): Promise<Buffer> {
  return this.pdfService.generatePdf(options);
}
}
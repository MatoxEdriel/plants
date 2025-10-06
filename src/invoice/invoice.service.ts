import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { prisma } from '@novaCode/resource';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class InvoiceService {
  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    const created = await prisma.invoice.create({ data: dto });
    return plainToInstance(Invoice, created);
  }

  async findAll(): Promise<Invoice[]> {
    const invoices = await prisma.invoice.findMany();
    return invoices.map((inv) => ({
      ...inv,
      total: inv.Total ?? null,
    })) as Invoice[];
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { MessagePattern } from '@nestjs/microservices';

@Injectable()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @MessagePattern({ cmd: 'create_invoice' })
  async create(dto: CreateInvoiceDto) {
    return this.invoiceService.create(dto);
  }

  @MessagePattern({ cmd: 'find_all_invoices' })
  async findAllInvoices() {
    return this.invoiceService.findAll();
  }
}

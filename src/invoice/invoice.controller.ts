/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { TableData } from 'src/services/tableData.interface';
import { table } from 'console';

@Injectable()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) { }

  @MessagePattern({ cmd: 'create_invoice' })
  async create(@Payload() dto: CreateInvoiceDto) {
    return this.invoiceService.create(dto);
  }

  @MessagePattern({ cmd: 'find_all_invoices' })
  async findAllInvoices() {
    return this.invoiceService.findAll();
  }


  @MessagePattern({ cmd: 'download-pdf' })
  async downloadPdf(@Payload() tableData: TableData) {
    const pdfBuffer = await this.invoiceService.generatePdfFromFront(tableData);
    return pdfBuffer;
  }


  @MessagePattern({ cmd: 'generate-pdf' })
  async generatePdf(@Payload() html: string) {
    const pdfBuffer = await this.invoiceService.generatePdfFromHtml(html);
    return pdfBuffer;
  }





}

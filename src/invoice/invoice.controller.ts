/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { InvoiceService, InvoiceWithTracksDto } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { TableData } from 'src/services/tableData.interface';
import { table } from 'console';
import { parseArgs } from 'util';

@Injectable()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) { }

  @MessagePattern({ cmd: 'create_invoice' })
  async create(@Payload() dto: CreateInvoiceDto) {
    return this.invoiceService.create(dto);
  }

  @MessagePattern({ cmd: 'find_all_invoices' })
  async findAllInvoices(
    @Payload() params: { page: number; limit: number; filter?: string },


  ) {



    return this.invoiceService.findAll(params);
  }

  @MessagePattern({ cmd: 'generate-pdf' })
  async generatePdf(@Payload() options: any) {
    const pdfBuffer = await this.invoiceService.generatePdf(options);
    return pdfBuffer;
  }



  @MessagePattern({ cmd: 'find_all_invoices_with_tracks' })
  async findAllInvoicesWithTracks(): Promise<InvoiceWithTracksDto[]> {
    return this.invoiceService.findAllWithTracks();
  }
}

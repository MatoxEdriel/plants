import { Injectable } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { INVOICE_CMD } from '@novaCode/resource';
import { InvoiceWithTracksDto } from './dto/invoice-with-tracks.dto';



@Injectable()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) { }

  @MessagePattern(INVOICE_CMD.CREATE)
  async create(@Payload() dto: CreateInvoiceDto) {
    return this.invoiceService.create(dto);
  }

  @MessagePattern(INVOICE_CMD.FIND_ALL)
  async findAllInvoices(
    @Payload() params: { page: number; limit: number; filter?: string },
  ) {
    return this.invoiceService.findAll(params);
  }

  @MessagePattern(INVOICE_CMD.GENERATE_PDF)
  async generatePdf(@Payload() options: any) {
    const pdfBuffer = await this.invoiceService.generatePdf(options);
    return pdfBuffer;
  }



  @MessagePattern(INVOICE_CMD.FIND_ALL_WITH_TRACKS)
  async findAllInvoicesWithTracks(): Promise<InvoiceWithTracksDto[]> {
    return this.invoiceService.findAllWithTracks();
  }
}

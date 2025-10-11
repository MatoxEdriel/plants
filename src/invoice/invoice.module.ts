import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { PdfGeneratorServices } from 'src/services/generatePdf.service';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService, PdfGeneratorServices],
})
export class InvoiceModule {}

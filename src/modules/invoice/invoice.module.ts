import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { PdfGeneratorServices } from 'src/services/generatePdf.service';
import { PrismaService } from '@novaCode/resource';


@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService, PdfGeneratorServices, PrismaService],

})
export class InvoiceModule { }

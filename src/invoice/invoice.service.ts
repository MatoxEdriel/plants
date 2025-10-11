import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { prisma } from '@novaCode/resource';
import { plainToInstance } from 'class-transformer';
import { PdfGeneratorServices } from 'src/services/generatePdf.service';
import { TableData } from 'src/services/tableData.interface';
import { table } from 'console';

@Injectable()
export class InvoiceService {


  constructor(private readonly pdfService: PdfGeneratorServices) {


  }


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

  async generatePdfFromFront(tableData: TableData): Promise<Buffer> {
    console.log('TableData received:', tableData);

  
    const pdfBuffer = await this.pdfService.generatePdfFromTable(tableData);

    console.log('PDF generated successfully, size:', pdfBuffer.length);
    return pdfBuffer; 
  }

 async generatePdfFromHtml(html: string): Promise<Buffer> {
    console.log('HTML received for PDF generation');
    const pdfBuffer = await this.pdfService.generatePdfFromHtml(html);
    console.log('PDF generated successfully (HTML), size:', pdfBuffer.length);
    return pdfBuffer;
  }




  

}

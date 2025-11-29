import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { MICROSERVICE_RESPONSES, PrismaService, BaseMicroserviceStatusEnum, ManageResponse } from '@novaCode/resource';
import { plainToInstance } from 'class-transformer';
import { PdfGeneratorServices } from 'src/services/generatePdf.service';
import { PdfOptions } from 'src/services/tableData.interface';
import { InvoiceWithTracksDto } from './dto/invoice-with-tracks.dto';
import { PaginationParams } from 'src/interfaces/PaginationParams.interface';
import { BaseService } from 'src/interfaces/BaseService';

@Injectable()
export class InvoiceService extends BaseService<any> {

  constructor(
    private readonly pdfService: PdfGeneratorServices,
    protected readonly prisma: PrismaService
  ) {
    super(prisma, prisma.invoice)
  }
ß
  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    const created = this.prisma.invoice.create({ data: dto });
    return plainToInstance(Invoice, created);
  }


  async findAll(params: PaginationParams) {

    const where = params.filter
      ? {
        OR: [
          { BillingCity: { contains: params.filter, mode: 'insensitive' } },
          { BillingCountry: { contains: params.filter, mode: 'insensitive' } },
        ],
      }
      : {};

    const result = await this.paginate({
      page: params.page,
      limit: params.limit,
      where,
      orderBy: { InvoiceId: 'desc' }

    })

    return ManageResponse.microservice({
      data: result.data,
      page: result.page,
      total: result.total,
      totalPage: result.totalPages
    },
      {
        status: BaseMicroserviceStatusEnum.success,
        message: MICROSERVICE_RESPONSES.general.success

      }
    )










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
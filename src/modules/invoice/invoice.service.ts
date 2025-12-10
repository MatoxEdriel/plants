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

  awards: any[] = [
    { threshold: 100, award: 'Bronze' },
    { threshold: 500, award: 'Silver' },
    { threshold: 1000, award: 'Gold' }


  ];

  constructor(
    private readonly pdfService: PdfGeneratorServices,
    protected readonly prisma: PrismaService
  ) {
    super(prisma, prisma.invoice)
  }

  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    const created = this.prisma.invoice.create({ data: dto });
    return plainToInstance(Invoice, created);
  }



  //Traer toda la ifnormaicondeujn client epor customer iD

  async getCustomerByInvoicesId(customerId: number): Promise<any> {

    //  Necesito traer la informaicon cokpleta de ahi tengo el id y busco ese
    // 
    const customerData = await this.prisma.invoice.findFirst({
      where: {
        CustomerId: customerId
      },
      include: {
        //Detecta el id relacionad ay trae dl mismo elnombre de al tabla
        Customer: true
      }
    })
    return customerData?.Customer;
  }


  //Practica devolver todos los IDs de la facturas 
  async getAllIdsInvoices(): Promise<number[]> {

    //!Primero debo traer los ids primero 
    const allInvoices = await this.prisma.invoice.findMany({
      select: {
        InvoiceId: true

      },
      distinct: ['InvoiceId']

    })

    const allInvoicesIds = allInvoices.map((invoices) => invoices.InvoiceId)

    return allInvoicesIds


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




    const responsePayload = {
      items: result.data,
      pagination: {
        page: result.page,
        limit: params.limit,
        total: result.total,
        totalPage: result.totalPages
      }
    };

    return ManageResponse.microservice(
      responsePayload
      ,
      {
        status: BaseMicroserviceStatusEnum.success,
        message: MICROSERVICE_RESPONSES.general.success

      }
    )










  }







  //TODO: Practicar ahora revisraremos un metodo. traere todo slos customerId 
  //!PRIMERO es traer el array 

  //Practica traer todos los CustomersId de las facturas 
  public async showAllInvoicesCustomerId() {

    const allCustomerIda = await this.prisma.invoice.findMany({
      select: {
        CustomerId: true
      },
      distinct: ['CustomerId']
    })

    const allInvoicesId = allCustomerIda.map((p) => p.CustomerId);

    return allInvoicesId;


  }



  public showTotalInvoicesCustomer(customerId: number) {
    // primero obtengo esto el id en cuestion leugo cvamos asumar 
    //con este metodo puedes hacer calculos matematicos 
    const totalInvoices = this.prisma.invoice.aggregate({
      where: {
        CustomerId: customerId
      },
      _sum: {
        //con esto sumas el total de la columna 
        Total: true
      }
    })
  }



  ///Repasar cuado se pone el promise 
  //!Por ejemplo esto me va a arrojar si es un ganaro si alcanzo la meta 

  async isEarnAward(customerId: number): Promise<any> {
    //Me deuvlve que gano  entonces eso me da un total 
    const totalInvoices = this.showTotalInvoicesCustomer(customerId)

    if (totalInvoices! >= 200) {
      return 'Gold Award'
    }


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
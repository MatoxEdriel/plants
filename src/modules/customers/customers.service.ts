import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

import { BaseMicroserviceStatusEnum, ManageResponse, MICROSERVICE_RESPONSES, PrismaService } from '@novaCode/resource';
import { BaseService } from 'src/interfaces/BaseService';
import { PaginationParams } from 'src/interfaces/PaginationParams.interface';
import { exist } from 'joi';
import { totalmem } from 'os';

@Injectable()
export class CustomersService extends BaseService<any> {

  constructor(
    protected readonly prisma: PrismaService
  ) {
    super(prisma, prisma.customer);
  }

  async findAll(params: PaginationParams) {

    const where = params.filter
      ? {
        OR: [
          { Company: { contains: params.filter, mode: 'insensitive' } },
          { FirstName: { contains: params.filter, mode: 'insensitive' } },
          { LastName: { contains: params.filter, mode: 'insensitive' } }
        ]
      }
      : {};

    const result = await this.paginate({
      page: params.page,
      limit: params.limit,
      where,
      orderBy: { CustomerId: 'desc' }
    })

    const responsePayload = {
      items: result.data,
      pagination: {
        page: result.page,
        limit: params.limit,
        total: result.total,
        totalPage: result.totalPages
      }
    }

    return ManageResponse.microservice(
      responsePayload,
      {
        status: BaseMicroserviceStatusEnum.success,
        message: MICROSERVICE_RESPONSES.general.success

      }
    )

  }



  //Practiquemos el update 





  async create(Payload: CreateCustomerDto) {
    const customer = await this.prisma.customer.create({
      data: {
        ...Payload
      }
    });
    return ManageResponse.microservice(
      { data: customer },
      {
        status: BaseMicroserviceStatusEnum.success,
        message: MICROSERVICE_RESPONSES.general.success,
      },
    );





  }








  //ok primero debemos revisar que datos se pueda cambiar
  //!Recuerda Gabriel que hay datos que si o si se deben enviar para el input
  //? en este caso vimos datos not null


  async findOneOrThrow(id: number) {
    const existCustomer = await this.prisma.customer.findUnique({
      where: {
        CustomerId: id
      },
      select: {
        CustomerId: true
      }
    })

    if (!existCustomer) {

      throw new NotFoundException(`Id ${id} is not founder`)
    }

    return existCustomer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    await this.findOneOrThrow(id);

    //Usar metodo desde el resoruce 
    const data = Object.fromEntries(
      Object.entries(updateCustomerDto).filter(([_, v]) => v !== undefined)
    );
    const customerUpdated = await this.prisma.customer.update({
      where: {
        CustomerId: id
      },
      data,
      select: {
        FirstName: true,
        LastName: true,
        Address: true,
      }
    })
    return ManageResponse.microservice(
      { data: customerUpdated },
      {
        status: BaseMicroserviceStatusEnum.success,
        message: MICROSERVICE_RESPONSES.general.success,
      },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}

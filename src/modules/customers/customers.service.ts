import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

import { BaseMicroserviceStatusEnum, ManageResponse, MICROSERVICE_RESPONSES, PrismaService } from '@novaCode/resource';
import { BaseService } from 'src/interfaces/BaseService';
import { PaginationParams } from 'src/interfaces/PaginationParams.interface';

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
    return ManageResponse.microservice({
      data: result.data,
      page: result.page,
      total: result.total,
      totalPage: result.totalPages
    },
      {
        status: BaseMicroserviceStatusEnum.success,
        messsage: MICROSERVICE_RESPONSES.general.success

      }
    )

  }



  create(createCustomerDto: CreateCustomerDto) {
    return 'This action adds a new customer';
  }



  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}

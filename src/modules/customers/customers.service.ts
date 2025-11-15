import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

import { PrismaService } from '@novaCode/resource';

@Injectable()
export class CustomersService {

  constructor(
    private readonly prisma: PrismaService
  ) {



  }


  create(createCustomerDto: CreateCustomerDto) {
    return 'This action adds a new customer';
  }

  async findAll(params: { page: number | string; limit: number | string; filter?: string }) {



    //Primero pasaremos lo parametros de paginado 

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;

    //Aqui creas filtros dinamicos, con la condicion ternaria
    //Entotonces recibe dos situacione cuando 

    const where = params.filter ?
      {
        OR: [
          { Company: { contains: params.filter, mode: 'insensitive' } },
          { FirstName: { contains: params.filter, mode: 'insensitive' } },
          { LastName: { contains: params.filter, mode: 'insentive' } }
        ],
      }
      : {};


    // que se quiere hace r? 
    //primero saacremo sla data y la cantidad por esa razon
    // usaremos esta constante 
    const [data, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        skip,
        take: limit,
        where,
        orderBy: { CustomerId: 'desc' }
      }),
      this.prisma.customer.count({ where })
    ]);

    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
      page,

    }

    //


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

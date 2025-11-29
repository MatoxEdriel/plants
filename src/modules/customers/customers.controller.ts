import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CUSTOMER_CMD } from '@novaCode/resource';
@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

  @MessagePattern(CUSTOMER_CMD.CREATE)
  create(@Payload() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }


  @MessagePattern(CUSTOMER_CMD.FIND_ALL)
  async findAll(
    @Payload() params: { page: number; limit: number; filter?: string }

  ) {
    return this.customersService.findAll(params);
  }

  @MessagePattern(CUSTOMER_CMD.FIND_ONE_CUSTOMER)
  findOne(@Payload() id: number) {
    return this.customersService.findOne(id);
  }

  @MessagePattern(CUSTOMER_CMD.UPDATE)
  update(@Payload() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(updateCustomerDto.id, updateCustomerDto);
  }

  @MessagePattern(CUSTOMER_CMD.DELETE)
  remove(@Payload() id: number) {
    return this.customersService.remove(id);
  }




}

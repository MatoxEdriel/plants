import { Module } from '@nestjs/common';
import { PlantModule } from './modules/plant/plant.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { CustomersModule } from './modules/customers/customers.module';

@Module({
  imports: [PlantModule, InvoiceModule, CustomersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        NODE_ENV: Joi.string().valid('development', 'production').default('development')
      })
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

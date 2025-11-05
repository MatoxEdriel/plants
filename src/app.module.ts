import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlantModule } from './plant/plant.module';
import { InvoiceModule } from './invoice/invoice.module';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [PlantModule, InvoiceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        NODE_ENV: Joi.string().valid('development', 'production').default('development')
      })
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlantModule } from './plant/plant.module';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [PlantModule, InvoiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

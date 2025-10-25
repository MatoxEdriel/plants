import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ExceptionFilter } from './common/exceptions/rpc.exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: envs.port,
      },
    },
  );
  app.useGlobalFilters(new ExceptionFilter());  
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen();
  
  
  console.log(`Microservice on the port ${envs.port}`);
}
bootstrap();

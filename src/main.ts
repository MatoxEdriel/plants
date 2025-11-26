import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {


  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);


  const port = configService.get<number>('PORT');
  const host = '0.0.0.0';

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host,
      port,
    },
  });

  await app.startAllMicroservices();




  console.log(`Microservice on the port ${host}:${port}`);
}
bootstrap();

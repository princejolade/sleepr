import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { setApp } from './app';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const configService = app.get(ConfigService);
  const HTTP_PORT = configService.get('HTTP_PORT');
  const LOGGER = app.get(Logger);

  app.useLogger(LOGGER);


  await app.listen(HTTP_PORT);
    setApp(app);
}
bootstrap();

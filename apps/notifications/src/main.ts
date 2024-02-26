import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { NOTIFICATIONS_PACKAGE_NAME } from '@app/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const configService = app.get(ConfigService);
  const LOGGER = app.get(Logger);
  const NOTIFICATIONS_GRPC_URL = configService.get('NOTIFICATIONS_GRPC_URL');

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: NOTIFICATIONS_PACKAGE_NAME,
      protoPath: join(__dirname, '../../..', 'proto/notifications.proto'),
      url: NOTIFICATIONS_GRPC_URL,
    },
  });

  app.useLogger(LOGGER);
  await app.startAllMicroservices();
}
bootstrap();

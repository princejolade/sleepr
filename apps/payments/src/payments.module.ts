import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import {
  LoggerModule,
  NOTIFICATIONS_PACKAGE_NAME,
  NOTIFICATIONS_SERVICE_NAME,
} from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NOTIFICATIONS_GRPC_URL: Joi.string().required(),
        PAYMENTS_GRPC_URL: Joi.string().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: NOTIFICATIONS_PACKAGE_NAME,
            protoPath: join(__dirname, '../../..', 'proto/notifications.proto'),
            url: configService.get('NOTIFICATIONS_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    LoggerModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}

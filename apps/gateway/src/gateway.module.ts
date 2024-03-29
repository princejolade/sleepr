import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  LoggerModule,
} from '@app/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { authContext } from './auth.context';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        AUTH_GRPC_URL: Joi.string().required(),
        RESERVATIONS_GRAPHQL_URL: Joi.string().required(),
      }),
    }),
    LoggerModule,
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      useFactory: (configService: ConfigService) => ({
          server: {
            context: authContext,
          },
          gateway: {
            supergraphSdl: new IntrospectAndCompose({
              subgraphs: [
                {
                  name: 'reservations',
                  url: configService.get('RESERVATIONS_GRAPHQL_URL'),
                },
              ],
            }),
            buildService({ url }) {
              return new RemoteGraphQLDataSource({
                url,
                willSendRequest({ request, context }) {
                    request.http.headers.set("user", context.user ? JSON.stringify(context.user) : null)
                },
                })
            },
          },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: AUTH_PACKAGE_NAME,
            protoPath: join(__dirname, '../../..', 'proto/auth.proto'),
            url: configService.get('AUTH_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
})
export class GatewayModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConfiguration } from './settings/configuration';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],
    }),
    ClientsModule.registerAsync([
      {
        name: 'USER_REQUEST_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.TCP,
            options: {
              // host: configService.get<string>('FILES_TCP'),
              host: '0.0.0.0',
              port: 3001,
            },
          };
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

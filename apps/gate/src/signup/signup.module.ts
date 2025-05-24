import { Module } from '@nestjs/common';
import { SignupService } from './signup.service';
import { SignupController } from './signup.controller';
import { GateService } from '../../../../apps/libs/gateService';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { ProducerService } from 'apps/libs/common/message-brokers/rabbit/providers/producer.service';
import { RabbitProducerModule } from 'apps/libs/common/message-brokers/rabbit/rabbit-producer.module';

@Module({
  imports: [
    HttpModule,
    UsersModule,
    RabbitProducerModule.register(['users']),
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [SignupController],
  providers: [SignupService, GateService],
})
export class SignupModule {}

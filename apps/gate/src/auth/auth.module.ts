import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { GateService } from '../../../../apps/libs/gateService';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoginValidationMiddleware } from './middleware/login-validation.middleware';
import { UsersModule } from '../users/users.module';
import { RabbitProducerModule } from 'apps/libs/common/message-brokers/rabbit/rabbit-producer.module';
import { SignupService } from '../signup/signup.service';
import { GoogleOauth } from './oauth/google.oauth';

@Module({
  imports: [
    RabbitProducerModule.register(['mailer']),
    HttpModule,
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: 'GateService', useClass: GateService },
    GateService,
    SignupService,
    GoogleOauth,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginValidationMiddleware).forRoutes('auth/login');
  }
}

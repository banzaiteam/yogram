import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { GateService } from '../../../../apps/libs/gateService';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoginValidationMiddleware } from './middleware/login-validation.middleware';
import { UsersModule } from '../users/users.module';
import { RabbitProducerModule } from '../../../../apps/libs/common/message-brokers/rabbit/rabbit-producer.module';
import { SignupService } from '../signup/signup.service';
import { GoogleOauth } from './oauth/google.oauth';
import { SessionProvider } from './session/session.provider';
import { RedisModule } from '../../../../apps/libs/common/redis/redis.module';
import { RefreshGuard } from './guards/refresh.guard';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    RabbitProducerModule.register(['mailer']),
    HttpModule,
    RedisModule,
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
    SessionProvider,
    AuthService,
    { provide: 'GateService', useClass: GateService },
    GateService,
    SignupService,
    GoogleOauth,
    SessionProvider,
    RefreshGuard,
  ],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginValidationMiddleware).forRoutes('auth/login');
  }
}

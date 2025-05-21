import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HttpModule } from '@nestjs/axios';
import { GateService } from '../../../../apps/libs/gateService';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from 'apps/gate/common/guards/auth.guard';

@Module({
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    GateService,
    { provide: 'APP_GUARD', useClass: AuthGuard },
  ],
})
export class UsersModule {}

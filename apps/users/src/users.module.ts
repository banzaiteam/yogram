import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import { getConfiguration } from './settings/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }

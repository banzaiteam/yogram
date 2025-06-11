import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { HttpModule } from '@nestjs/axios';
import { GateService } from '../../../libs/gateService';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AuthModule } from '../auth/auth.module';

import { MulterModule } from '@nestjs/platform-express';
import path from 'path';
import { ChunksFileUploader } from 'apps/libs/common/upload/chunks-file-uploader.service';

@Module({
  imports: [
    MulterModule.register({
      // dest: path.resolve('.', 'apps/gate/src/posts/uploads'),
    }),
    AuthModule,
    HttpModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [PostsController],
  providers: [
    ChunksFileUploader,
    PostsService,
    GateService,
    { provide: 'APP_GUARD', useClass: AuthGuard },
  ],
  exports: [PostsService],
})
export class PostsModule {}

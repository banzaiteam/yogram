import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { GraphQLModule } from '@nestjs/graphql';
// import {
//   ApolloFederationDriver,
//   ApolloFederationDriverConfig,
// } from '@nestjs/apollo';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitProducerModule } from 'apps/libs/common/message-brokers/rabbit/rabbit-producer.module';
import { Post } from './infrastracture/entity/post.entity';
import { File } from './infrastracture/entity/file.entity';
import {
  EnvironmentMode,
  EnvironmentsTypes,
  getConfiguration,
} from '../../settings/configuration';
import { DatabaseModule } from 'apps/libs/common/database/database.module';
import { PostsController } from './api/posts.controller';
import { CreatePostUseCase } from './use-cases/create-post';
import { PostCommandService } from './post-command.service';
import { IPostCommandRepository } from './interfaces/Post.interface';
import { PostCommandRepository } from './infrastracture/repository/post-command.repository';
import { IFileCommandRepository } from './interfaces/File.interface';
import { FileCommandRepository } from './infrastracture/repository/file-command.repository';
import { FileCommandService } from './file-command.service';
import { ChunksFileUploaderModule } from 'apps/libs/common/upload/chunks-file-uploader.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ChunksFileUploaderModule,
    CqrsModule,
    MulterModule.register({}),
    // RabbitProducerModule.register(['posts']),
    DatabaseModule.register(),
    TypeOrmModule.forFeature([Post, File]),
    // GraphQLModule.forRoot<ApolloFederationDriverConfig>({
    //   driver: ApolloFederationDriver,
    //   autoSchemaFile: {
    //     federation: 2,
    //   },
    //   sortSchema: true,
    //   playground: true, // GraphQL UI
    //   // context: ({ req }) => ({ req }),
    //   path: '/api/v1/graphql',
    // }),
  ],
  controllers: [PostsController],
  providers: [
    CreatePostUseCase,
    PostCommandService,
    FileCommandService,
    { provide: IPostCommandRepository, useClass: PostCommandRepository },
    { provide: IFileCommandRepository, useClass: FileCommandRepository },
  ],
})
export class PostsModule {}

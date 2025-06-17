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
import { PostCommandService } from './post-command.service';
import { IPostCommandRepository } from './interfaces/post-command-repository.interface';
import { PostCommandRepository } from './infrastracture/repository/command/post-command.repository';
import { IFileCommandRepository } from './interfaces/file-command-repository.interface';
import { FileCommandRepository } from './infrastracture/repository/command/file-command.repository';
import { FileCommandService } from './file-command.service';
import { ChunksFileUploaderModule } from 'apps/libs/common/chunks-upload/chunks-file-uploader.module';
import { MulterModule } from '@nestjs/platform-express';
import { CreatePostCommandHandler } from './use-cases/commands/create-post.handler';
import { HttpModule } from '@nestjs/axios';
import {
  UpdatePostCommand,
  UpdatePostCommandHandler,
} from './use-cases/commands/update-post.handler';
import { RabbitConsumerModule } from 'apps/libs/common/message-brokers/rabbit/rabbit-consumer.module';
import { FilesBindingKeysEnum } from 'apps/files/src/features/files/message-brokers/rabbit/users-queue-bindings.constant';
import { PostsQueryService } from './posts-query.service';
import { PostsQueryRepository } from './infrastracture/repository/query/posts-query.repository';
import {
  GetPostsQuery,
  GetPostsQueryHandler,
} from './use-cases/queries/get-posts.query';

@Module({
  imports: [
    HttpModule,
    ChunksFileUploaderModule,
    CqrsModule,
    MulterModule.register({}),
    RabbitConsumerModule.register([
      { files: [FilesBindingKeysEnum.Files_Uploaded_Many] },
    ]),
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
    CreatePostCommandHandler,
    PostCommandService,
    FileCommandService,
    UpdatePostCommand,
    UpdatePostCommandHandler,
    PostsQueryService,
    PostsQueryRepository,
    GetPostsQuery,
    GetPostsQueryHandler,
    { provide: IPostCommandRepository, useClass: PostCommandRepository },
    { provide: IFileCommandRepository, useClass: FileCommandRepository },
  ],
})
export class PostsModule {}

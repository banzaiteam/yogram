import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({})
export class DatabaseModule {
  static register(): DynamicModule {
    console.log(__dirname);
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: configService.get('type'),
            url: configService.get('url'),
            extra: {
              max: 100,
              poolSize: 100,
            },
            connectionTimeoutMillis: 2000,
            idleTimeoutMillis: 30000,
            maxQueryExecutionTime: 5000,
            migrationsTableName: configService.get('migrationsTableName'),
            entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
            migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
            autoLoadEntities: configService.get('autoLoadEntities'),
            synchronize: configService.get('synchronize'),
            dropSchema: configService.get('dropSchema'),
          }),
          dataSourceFactory: async (options) => {
            const dataSource = await new DataSource(options).initialize();
            return dataSource;
          },
        }),
      ],
    };
  }
}

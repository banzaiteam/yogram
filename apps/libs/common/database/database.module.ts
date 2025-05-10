import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Profile } from 'apps/users/src/infrastructure/entity/Profile.entity';
import { User } from 'apps/users/src/infrastructure/entity/User.entity';
import { DataSource } from 'typeorm';

@Module({})
export class DatabaseModule {
  static register(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return {
              type: 'postgres',
              host: 'ep-lively-bush-a2mv49a9-pooler.eu-central-1.aws.neon.tech',
              port: 5432,
              username: 'neondb_owner',
              password: 'npg_RqNihtGd54IJ',
              database: 'users',
              migrationsTableName: 'migrations',
              entities: [User, Profile],
              migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
              autoLoadEntities: true,
              synchronize: false,
              extra: { ssl: true },
            };
          },
          dataSourceFactory: async (options) => {
            const dataSource = await new DataSource(options).initialize();
            return dataSource;
          },
        }),
      ],
    };
  }
}

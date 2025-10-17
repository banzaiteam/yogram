import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: '796163',
  database: 'users',
  entities: [`${__dirname}/../infrastructure/**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  extra: { ssl: false },
  synchronize: false,
  migrationsTableName: 'migrations',
});

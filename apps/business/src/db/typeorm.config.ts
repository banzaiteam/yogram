import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5435,
  username: 'postgres',
  password: '796163',
  database: 'business',
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  extra: { ssl: false },
  synchronize: false,
  migrationsTableName: 'migrations',
});

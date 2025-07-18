import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'ep-red-mouse-a2aq8grc-pooler.eu-central-1.aws.neon.tech',
  port: 5432,
  username: 'neondb_owner',
  password: 'npg_RqNihtGd54IJ',
  database: 'posts',
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations-prod/*{.ts,.js}`],
  extra: { ssl: true },
  synchronize: false,
  migrationsTableName: 'migrations-prod',
});

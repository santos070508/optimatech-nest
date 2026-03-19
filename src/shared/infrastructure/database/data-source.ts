import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv    from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type:        'postgres',
  host:        process.env.DB_HOST     ?? 'localhost',
  port:        parseInt(process.env.DB_PORT ?? '5432', 10),
  database:    process.env.DB_NAME     ?? 'optimatech_db',
  username:    process.env.DB_USER     ?? 'postgres',
  password:    process.env.DB_PASSWORD ?? '',
  synchronize: false,
  logging:     false,
  entities:    ['src/**/*.orm-entity.ts'],
  migrations:  ['src/shared/infrastructure/database/migrations/*.ts'],
});

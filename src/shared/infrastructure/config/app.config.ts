import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port:    parseInt(process.env.PORT ?? '3000', 10),
  env:     process.env.NODE_ENV ?? 'development',
  db: {
    host:     process.env.DB_HOST     ?? 'localhost',
    port:     parseInt(process.env.DB_PORT ?? '5432', 10),
    name:     process.env.DB_NAME     ?? 'optimatech_db',
    user:     process.env.DB_USER     ?? 'postgres',
    password: process.env.DB_PASSWORD ?? '',
    sync:     process.env.DB_SYNC     === 'true',
    logging:  process.env.DB_LOGGING  === 'true',
  },
  upload: {
    dir:         process.env.UPLOAD_DIR      ?? 'uploads',
    maxSizeMb:   parseInt(process.env.MAX_FILE_SIZE_MB ?? '5', 10),
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED !== 'false',
    path:    process.env.SWAGGER_PATH ?? 'api/docs',
  },
}));

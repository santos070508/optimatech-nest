import { Module }         from '@nestjs/common';
import { TypeOrmModule }  from '@nestjs/typeorm';
import { ConfigModule }   from '@nestjs/config';
import { CategoryOrmEntity } from '../../../modules/categories/infrastructure/persistence/category.orm-entity';
import { ProductOrmEntity }  from '../../../modules/products/infrastructure/persistence/product.orm-entity';
import { OrderOrmEntity }    from '../../../modules/orders/infrastructure/persistence/order.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => {
        const isProd      = process.env.NODE_ENV === 'production';
        const databaseUrl = process.env.DATABASE_URL;

        const base = {
          type:          'postgres' as const,
          entities:      [CategoryOrmEntity, ProductOrmEntity, OrderOrmEntity],
          synchronize:   process.env.DB_SYNC === 'true',
          logging:       process.env.DB_LOGGING === 'true',
          migrationsRun: false,
          // SSL requerido en Railway (PostgreSQL en la nube)
          ssl: isProd ? { rejectUnauthorized: false } : false,
          // Reintentar conexión si la BD aún no está lista
          retryAttempts:  10,
          retryDelay:     3000,
          connectTimeoutMS: 10000,
        };

        if (databaseUrl) {
          console.log('🐘 Usando DATABASE_URL (Railway)');
          return { ...base, url: databaseUrl };
        }

        console.log('🐘 Usando variables individuales DB_*');
        return {
          ...base,
          host:     process.env.DB_HOST     ?? 'localhost',
          port:     parseInt(process.env.DB_PORT ?? '5432', 10),
          database: process.env.DB_NAME     ?? 'optimatech_db',
          username: process.env.DB_USER     ?? 'postgres',
          password: process.env.DB_PASSWORD ?? '',
        };
      },
    }),
  ],
})
export class DatabaseModule {}

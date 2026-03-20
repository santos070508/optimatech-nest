import { Module }         from '@nestjs/common';
import { TypeOrmModule }  from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoryOrmEntity } from '../../../modules/categories/infrastructure/persistence/category.orm-entity';
import { ProductOrmEntity }  from '../../../modules/products/infrastructure/persistence/product.orm-entity';
import { OrderOrmEntity }    from '../../../modules/orders/infrastructure/persistence/order.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject:  [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd      = config.get('app.env') === 'production';
        const databaseUrl = process.env.DATABASE_URL;

        // Railway inyecta DATABASE_URL automáticamente con el plugin PostgreSQL.
        // Si está presente, lo usamos directamente; si no, usamos variables individuales.
        const baseConfig = {
          type:          'postgres' as const,
          entities:      [CategoryOrmEntity, ProductOrmEntity, OrderOrmEntity],
          synchronize:   config.get<boolean>('app.db.sync', false),
          logging:       config.get<boolean>('app.db.logging', false),
          migrationsRun: false,
          ssl: isProd ? { rejectUnauthorized: false } : false,
        };

        if (databaseUrl) {
          return { ...baseConfig, url: databaseUrl };
        }

        return {
          ...baseConfig,
          host:     config.get<string>('app.db.host'),
          port:     config.get<number>('app.db.port'),
          database: config.get<string>('app.db.name'),
          username: config.get<string>('app.db.user'),
          password: config.get<string>('app.db.password'),
        };
      },
    }),
  ],
})
export class DatabaseModule {}

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
      useFactory: (config: ConfigService) => ({
        type:        'postgres',
        host:        config.get<string>('app.db.host'),
        port:        config.get<number>('app.db.port'),
        database:    config.get<string>('app.db.name'),
        username:    config.get<string>('app.db.user'),
        password:    config.get<string>('app.db.password'),
        entities:    [CategoryOrmEntity, ProductOrmEntity, OrderOrmEntity],
        synchronize: config.get<boolean>('app.db.sync', false), // NEVER true en producción
        logging:     config.get<boolean>('app.db.logging', false),
        migrations:  ['dist/shared/infrastructure/database/migrations/*.js'],
        migrationsRun: false,
        ssl: config.get('app.env') === 'production'
          ? { rejectUnauthorized: false }
          : false,
      }),
    }),
  ],
})
export class DatabaseModule {}

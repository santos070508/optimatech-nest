import { Module }      from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig        from './shared/infrastructure/config/app.config';
import { DatabaseModule }    from './shared/infrastructure/database/database.module';
import { CategoriesModule }  from './modules/categories/categories.module';
import { ProductsModule }    from './modules/products/products.module';
import { OrdersModule }      from './modules/orders/orders.module';
import { FilesModule }       from './modules/files/files.module';

@Module({
  imports: [
    // ── Configuración global ─────────────────────────────────
    ConfigModule.forRoot({
      isGlobal:    true,
      envFilePath: '.env',
      load:        [appConfig],
    }),

    // ── Base de datos ────────────────────────────────────────
    DatabaseModule,

    // ── Módulos de negocio ───────────────────────────────────
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    FilesModule,
  ],
})
export class AppModule {}

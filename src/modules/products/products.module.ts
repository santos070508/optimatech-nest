import { Module }        from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity }              from './infrastructure/persistence/product.orm-entity';
import { ProductTypeOrmRepository }      from './infrastructure/persistence/product-typeorm.repository';
import { ProductsController }            from './infrastructure/http/products.controller';
import { PRODUCT_REPOSITORY }            from './domain/product.repository.port';
import { CategoriesModule }              from '../categories/categories.module';
import {
  ListProductsUseCase,
  GetProductUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
} from './application/use-cases/product.use-cases';

const USE_CASES = [
  ListProductsUseCase,
  GetProductUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductOrmEntity]),
    CategoriesModule,  // para validar que la categoría existe
  ],
  controllers: [ProductsController],
  providers: [
    ...USE_CASES,
    {
      provide:  PRODUCT_REPOSITORY,
      useClass: ProductTypeOrmRepository,
    },
  ],
  exports: [PRODUCT_REPOSITORY, ...USE_CASES],
})
export class ProductsModule {}

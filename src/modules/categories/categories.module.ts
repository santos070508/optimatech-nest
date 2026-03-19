import { Module }        from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryOrmEntity }              from './infrastructure/persistence/category.orm-entity';
import { CategoryTypeOrmRepository }      from './infrastructure/persistence/category-typeorm.repository';
import { CategoriesController }           from './infrastructure/http/categories.controller';
import { CATEGORY_REPOSITORY }            from './domain/category.repository.port';
import {
  ListCategoriesUseCase,
  GetCategoryUseCase,
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
} from './application/use-cases/category.use-cases';

/**
 * Aquí se realiza la inyección de dependencias:
 * PORT (CATEGORY_REPOSITORY) → ADAPTER (CategoryTypeOrmRepository)
 */
const USE_CASES = [
  ListCategoriesUseCase,
  GetCategoryUseCase,
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
];

@Module({
  imports:     [TypeOrmModule.forFeature([CategoryOrmEntity])],
  controllers: [CategoriesController],
  providers: [
    ...USE_CASES,
    {
      provide:  CATEGORY_REPOSITORY,
      useClass: CategoryTypeOrmRepository,
    },
  ],
  exports: [CATEGORY_REPOSITORY, ...USE_CASES],
})
export class CategoriesModule {}

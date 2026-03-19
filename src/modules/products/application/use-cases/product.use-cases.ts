import { Injectable, Inject } from '@nestjs/common';
import { Product }            from '../../domain/product.entity';
import {
  ProductRepositoryPort,
  ProductFilters,
  PRODUCT_REPOSITORY,
} from '../../domain/product.repository.port';
import {
  ProductNotFoundException,
  InvalidPriceException,
} from '../../domain/exceptions/product.exceptions';
import { CategoryRepositoryPort, CATEGORY_REPOSITORY } from '../../../categories/domain/category.repository.port';
import { CategoryNotFoundException } from '../../../categories/domain/exceptions/category-not-found.exception';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from '../dtos/product.dto';

function uid(): string {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

// ══════════════════════════════════════════════════════════════
//  LIST PRODUCTS
// ══════════════════════════════════════════════════════════════
@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repo: ProductRepositoryPort,
  ) {}

  execute(filters?: ProductFilterDto): Promise<Product[]> {
    const mapped: ProductFilters = {
      categoryId: filters?.category,
      stock:      filters?.stock,
      search:     filters?.q,
    };
    return this.repo.findAll(mapped);
  }
}

// ══════════════════════════════════════════════════════════════
//  GET PRODUCT
// ══════════════════════════════════════════════════════════════
@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repo: ProductRepositoryPort,
  ) {}

  async execute(id: string): Promise<Product> {
    const product = await this.repo.findById(id);
    if (!product) throw new ProductNotFoundException(id);
    return product;
  }
}

// ══════════════════════════════════════════════════════════════
//  CREATE PRODUCT
// ══════════════════════════════════════════════════════════════
@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: ProductRepositoryPort,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: CategoryRepositoryPort,
  ) {}

  async execute(dto: CreateProductDto): Promise<Product> {
    if (dto.price <= 0) throw new InvalidPriceException();

    // Verificar que la categoría existe
    const categoryExists = await this.categoryRepo.existsById(dto.categoryId);
    if (!categoryExists) throw new CategoryNotFoundException(dto.categoryId);

    const product = Product.create({
      id:          uid(),
      name:        dto.name,
      categoryId:  dto.categoryId,
      price:       dto.price,
      stock:       dto.stock,
      badge:       dto.badge       ?? '',
      description: dto.description ?? '',
      specs:       dto.specs       ?? [],
      images:      dto.images      ?? [],
    });

    return this.productRepo.save(product);
  }
}

// ══════════════════════════════════════════════════════════════
//  UPDATE PRODUCT
// ══════════════════════════════════════════════════════════════
@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: ProductRepositoryPort,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: CategoryRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepo.findById(id);
    if (!product) throw new ProductNotFoundException(id);

    if (dto.price !== undefined && dto.price <= 0) throw new InvalidPriceException();

    if (dto.categoryId) {
      const exists = await this.categoryRepo.existsById(dto.categoryId);
      if (!exists) throw new CategoryNotFoundException(dto.categoryId);
    }

    product.update({
      name:        dto.name,
      categoryId:  dto.categoryId,
      price:       dto.price,
      stock:       dto.stock,
      badge:       dto.badge,
      description: dto.description,
      specs:       dto.specs,
      images:      dto.images,
    });

    return this.productRepo.update(product);
  }
}

// ══════════════════════════════════════════════════════════════
//  DELETE PRODUCT
// ══════════════════════════════════════════════════════════════
@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repo: ProductRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const exists = await this.repo.existsById(id);
    if (!exists) throw new ProductNotFoundException(id);
    await this.repo.delete(id);
  }
}

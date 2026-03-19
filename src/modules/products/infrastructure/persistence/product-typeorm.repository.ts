import { Injectable }      from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product, StockStatus }       from '../../domain/product.entity';
import {
  ProductRepositoryPort,
  ProductFilters,
} from '../../domain/product.repository.port';
import { ProductOrmEntity } from './product.orm-entity';

@Injectable()
export class ProductTypeOrmRepository implements ProductRepositoryPort {

  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly ormRepo: Repository<ProductOrmEntity>,
  ) {}

  async findAll(filters?: ProductFilters): Promise<Product[]> {
    const where: Record<string, unknown> = {};
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.stock)      where.stock       = filters.stock;
    if (filters?.search)     where.name        = ILike(`%${filters.search}%`);

    const rows = await this.ormRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
    return rows.map(this.toDomain);
  }

  async findById(id: string): Promise<Product | null> {
    const row = await this.ormRepo.findOneBy({ id });
    return row ? this.toDomain(row) : null;
  }

  async save(product: Product): Promise<Product> {
    const saved = await this.ormRepo.save(this.toOrm(product));
    return this.toDomain(saved);
  }

  async update(product: Product): Promise<Product> {
    await this.ormRepo.update(product.id, {
      name:        product.name,
      categoryId:  product.categoryId,
      price:       product.price,
      stock:       product.stock,
      badge:       product.badge,
      description: product.description,
      specs:       product.specs,
      images:      product.images,
      updatedAt:   product.updatedAt,
    });
    const updated = await this.ormRepo.findOneByOrFail({ id: product.id });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete(id);
  }

  async existsById(id: string): Promise<boolean> {
    return this.ormRepo.existsBy({ id });
  }

  async countByCategory(categoryId: string): Promise<number> {
    return this.ormRepo.countBy({ categoryId });
  }

  // ── Mappers ──────────────────────────────────────────────────
  private toDomain(orm: ProductOrmEntity): Product {
    return new Product(
      orm.id,
      orm.name,
      orm.categoryId,
      Number(orm.price),
      orm.stock as StockStatus,
      orm.badge       ?? '',
      orm.description ?? '',
      orm.specs       ?? [],
      orm.images      ?? [],
      orm.createdAt,
      orm.updatedAt,
    );
  }

  private toOrm(domain: Product): Partial<ProductOrmEntity> {
    return {
      id:          domain.id,
      name:        domain.name,
      categoryId:  domain.categoryId,
      price:       domain.price,
      stock:       domain.stock,
      badge:       domain.badge,
      description: domain.description,
      specs:       domain.specs,
      images:      domain.images,
      createdAt:   domain.createdAt,
      updatedAt:   domain.updatedAt,
    };
  }
}

import { Product } from './product.entity';

export interface ProductFilters {
  categoryId?: string;
  stock?:      string;
  search?:     string;
}

export interface ProductRepositoryPort {
  findAll(filters?: ProductFilters): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  save(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
  existsById(id: string): Promise<boolean>;
  countByCategory(categoryId: string): Promise<number>;
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

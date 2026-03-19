import { Category } from './category.entity';

/**
 * PORT — Define el contrato que toda implementación de persistencia
 * debe cumplir. El dominio solo conoce esta interfaz, nunca la
 * implementación concreta (TypeORM, MongoDB, in-memory…).
 */
export interface CategoryRepositoryPort {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  save(category: Category): Promise<Category>;
  update(category: Category): Promise<Category>;
  delete(id: string): Promise<void>;
  existsById(id: string): Promise<boolean>;
}

/** Token de inyección de dependencias */
export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');

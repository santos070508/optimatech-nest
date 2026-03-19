import { Injectable, Inject } from '@nestjs/common';
import { Category }           from '../../domain/category.entity';
import {
  CategoryRepositoryPort,
  CATEGORY_REPOSITORY,
} from '../../domain/category.repository.port';
import { CategoryNotFoundException } from '../../domain/exceptions/category-not-found.exception';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';

// ── Generar ID desde el label ───────────────────────────────
function generateId(label: string): string {
  const base = label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 40);
  const suffix = Date.now().toString(36).slice(-4);
  return `${base}-${suffix}`;
}

// ══════════════════════════════════════════════════════════════
//  LIST CATEGORIES
// ══════════════════════════════════════════════════════════════
@Injectable()
export class ListCategoriesUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly repo: CategoryRepositoryPort,
  ) {}

  execute(): Promise<Category[]> {
    return this.repo.findAll();
  }
}

// ══════════════════════════════════════════════════════════════
//  GET CATEGORY
// ══════════════════════════════════════════════════════════════
@Injectable()
export class GetCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly repo: CategoryRepositoryPort,
  ) {}

  async execute(id: string): Promise<Category> {
    const category = await this.repo.findById(id);
    if (!category) throw new CategoryNotFoundException(id);
    return category;
  }
}

// ══════════════════════════════════════════════════════════════
//  CREATE CATEGORY
// ══════════════════════════════════════════════════════════════
@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly repo: CategoryRepositoryPort,
  ) {}

  async execute(dto: CreateCategoryDto): Promise<Category> {
    const category = Category.create({
      id:          generateId(dto.label),
      label:       dto.label,
      icon:        dto.icon,
      description: dto.description ?? '',
      color:       dto.color,
    });
    return this.repo.save(category);
  }
}

// ══════════════════════════════════════════════════════════════
//  UPDATE CATEGORY
// ══════════════════════════════════════════════════════════════
@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly repo: CategoryRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.repo.findById(id);
    if (!category) throw new CategoryNotFoundException(id);
    category.update(dto);
    return this.repo.update(category);
  }
}

// ══════════════════════════════════════════════════════════════
//  DELETE CATEGORY
// ══════════════════════════════════════════════════════════════
@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly repo: CategoryRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const exists = await this.repo.existsById(id);
    if (!exists) throw new CategoryNotFoundException(id);
    await this.repo.delete(id);
  }
}

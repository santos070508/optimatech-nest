import { Injectable }      from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository }       from 'typeorm';
import { Category }                from '../../domain/category.entity';
import { CategoryRepositoryPort }  from '../../domain/category.repository.port';
import { CategoryOrmEntity }       from './category.orm-entity';

/**
 * ADAPTER — implementación concreta del PORT.
 * Traduce entre la entidad de dominio y la entidad ORM.
 * El dominio nunca ve TypeORM.
 */
@Injectable()
export class CategoryTypeOrmRepository implements CategoryRepositoryPort {

  constructor(
    @InjectRepository(CategoryOrmEntity)
    private readonly ormRepo: Repository<CategoryOrmEntity>,
  ) {}

  async findAll(): Promise<Category[]> {
    const rows = await this.ormRepo.find({ order: { label: 'ASC' } });
    return rows.map(this.toDomain);
  }

  async findById(id: string): Promise<Category | null> {
    const row = await this.ormRepo.findOneBy({ id });
    return row ? this.toDomain(row) : null;
  }

  async save(category: Category): Promise<Category> {
    const entity = this.toOrm(category);
    const saved  = await this.ormRepo.save(entity);
    return this.toDomain(saved);
  }

  async update(category: Category): Promise<Category> {
    await this.ormRepo.update(category.id, {
      label:       category.label,
      icon:        category.icon,
      description: category.description,
      color:       category.color,
      updatedAt:   category.updatedAt,
    });
    const updated = await this.ormRepo.findOneByOrFail({ id: category.id });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete(id);
  }

  async existsById(id: string): Promise<boolean> {
    return this.ormRepo.existsBy({ id });
  }

  // ── Mappers ──────────────────────────────────────────────────
  private toDomain(orm: CategoryOrmEntity): Category {
    return new Category(
      orm.id,
      orm.label,
      orm.icon,
      orm.description ?? '',
      orm.color,
      orm.createdAt,
      orm.updatedAt,
    );
  }

  private toOrm(domain: Category): CategoryOrmEntity {
    const entity        = new CategoryOrmEntity();
    entity.id           = domain.id;
    entity.label        = domain.label;
    entity.icon         = domain.icon;
    entity.description  = domain.description;
    entity.color        = domain.color;
    entity.createdAt    = domain.createdAt;
    entity.updatedAt    = domain.updatedAt;
    return entity;
  }
}

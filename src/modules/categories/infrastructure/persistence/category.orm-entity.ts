import {
  Entity, PrimaryColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

/**
 * ORM ENTITY — pertenece a la capa de infraestructura.
 * Sabe de TypeORM pero no de la lógica de negocio.
 */
@Entity('categories')
export class CategoryOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 80 })
  id: string;

  @Column({ type: 'varchar', length: 120 })
  label: string;

  @Column({ type: 'varchar', length: 10, default: '📦' })
  icon: string;

  @Column({ type: 'text', nullable: true, default: '' })
  description: string;

  @Column({ type: 'varchar', length: 10, default: '#FF6200' })
  color: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

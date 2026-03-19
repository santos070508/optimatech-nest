import {
  Entity, PrimaryColumn, Column, ManyToOne,
  JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { CategoryOrmEntity } from '../../../categories/infrastructure/persistence/category.orm-entity';

@Entity('products')
export class ProductOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  id: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ name: 'category_id', type: 'varchar', length: 80, nullable: true })
  categoryId: string;

  @ManyToOne(() => CategoryOrmEntity, { onDelete: 'SET NULL', nullable: true, eager: false })
  @JoinColumn({ name: 'category_id' })
  category: CategoryOrmEntity;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'in-stock',
    enum: ['in-stock', 'low-stock', 'out-stock'],
  })
  stock: string;

  @Column({ type: 'varchar', length: 60, default: '', nullable: true })
  badge: string;

  @Column({ type: 'text', nullable: true, default: '' })
  description: string;

  @Column({ type: 'text', array: true, default: '{}' })
  specs: string[];

  @Column({ type: 'text', array: true, default: '{}' })
  images: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('orders')
export class OrderOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  customer: Record<string, unknown>;

  @Column({ type: 'jsonb' })
  items: Record<string, unknown>[];

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'varchar',
    length: 30,
    default: 'pending',
  })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

import { Order } from './order.entity';

export interface OrderRepositoryPort {
  findAll(): Promise<Order[]>;
  findById(id: number): Promise<Order | null>;
  save(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order>;
}

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

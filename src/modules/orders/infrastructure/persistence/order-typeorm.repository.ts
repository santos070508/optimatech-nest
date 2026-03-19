import { Injectable }      from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository }       from 'typeorm';
import { Order, OrderItem, CustomerInfo, OrderStatus } from '../../domain/order.entity';
import { OrderRepositoryPort }   from '../../domain/order.repository.port';
import { OrderOrmEntity }        from './order.orm-entity';

@Injectable()
export class OrderTypeOrmRepository implements OrderRepositoryPort {

  constructor(
    @InjectRepository(OrderOrmEntity)
    private readonly ormRepo: Repository<OrderOrmEntity>,
  ) {}

  async findAll(): Promise<Order[]> {
    const rows = await this.ormRepo.find({ order: { createdAt: 'DESC' } });
    return rows.map(this.toDomain);
  }

  async findById(id: number): Promise<Order | null> {
    const row = await this.ormRepo.findOneBy({ id });
    return row ? this.toDomain(row) : null;
  }

  async save(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const entity = this.ormRepo.create({
      customer: order.customer as unknown as Record<string, unknown>,
      items:    order.items.map(i => ({
        productId: i.productId,
        name:      i.name,
        price:     i.price,
        qty:       i.qty,
        subtotal:  i.subtotal,
      })),
      total:    order.total,
      status:   order.status,
    });
    const saved = await this.ormRepo.save(entity);
    return this.toDomain(saved);
  }

  // ── Mapper ────────────────────────────────────────────────────
  private toDomain(orm: OrderOrmEntity): Order {
    const c = orm.customer as any;
    const customer = new CustomerInfo(
      c.name, c.email, c.phone, c.address, c.notes ?? '',
    );
    const items = (orm.items as any[]).map(
      (i: any) => new OrderItem(i.productId, i.name, Number(i.price), i.qty),
    );
    return new Order(
      orm.id,
      customer,
      items,
      Number(orm.total),
      orm.status as OrderStatus,
      orm.createdAt,
    );
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { Order, OrderItem, CustomerInfo } from '../../domain/order.entity';
import { OrderRepositoryPort, ORDER_REPOSITORY } from '../../domain/order.repository.port';
import { NotFoundException } from '../../../../shared/domain/exceptions/index';
import { CreateOrderDto } from '../dtos/order.dto';

// ══════════════════════════════════════════════════════════════
//  LIST ORDERS
// ══════════════════════════════════════════════════════════════
@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repo: OrderRepositoryPort,
  ) {}

  execute(): Promise<Order[]> {
    return this.repo.findAll();
  }
}

// ══════════════════════════════════════════════════════════════
//  GET ORDER
// ══════════════════════════════════════════════════════════════
@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repo: OrderRepositoryPort,
  ) {}

  async execute(id: number): Promise<Order> {
    const order = await this.repo.findById(id);
    if (!order) throw new NotFoundException('Pedido', id);
    return order;
  }
}

// ══════════════════════════════════════════════════════════════
//  CREATE ORDER
// ══════════════════════════════════════════════════════════════
@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repo: OrderRepositoryPort,
  ) {}

  async execute(dto: CreateOrderDto): Promise<Order> {
    const customer = new CustomerInfo(
      dto.customer.name,
      dto.customer.email,
      dto.customer.phone,
      dto.customer.address,
      dto.customer.notes ?? '',
    );

    const items = dto.items.map(
      i => new OrderItem(i.productId, i.name, i.price, i.qty),
    );

    const total = items.reduce((sum, i) => sum + i.subtotal, 0);

    return this.repo.save({
      customer,
      items,
      total,
      status: 'pending',
    } as any);
  }
}

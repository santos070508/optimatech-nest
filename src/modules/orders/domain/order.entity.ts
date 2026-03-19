// ── Value Object: OrderItem ───────────────────────────────────
export class OrderItem {
  constructor(
    public readonly productId: string,
    public readonly name:      string,
    public readonly price:     number,
    public readonly qty:       number,
  ) {}

  get subtotal(): number {
    return this.price * this.qty;
  }
}

// ── Value Object: CustomerInfo ────────────────────────────────
export class CustomerInfo {
  constructor(
    public readonly name:    string,
    public readonly email:   string,
    public readonly phone:   string,
    public readonly address: string,
    public readonly notes:   string,
  ) {}
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

// ── Domain Entity: Order ──────────────────────────────────────
export class Order {
  constructor(
    public readonly id:        number,
    public readonly customer:  CustomerInfo,
    public readonly items:     OrderItem[],
    public readonly total:     number,
    public          status:    OrderStatus,
    public readonly createdAt: Date,
  ) {}

  static create(props: {
    customer: CustomerInfo;
    items:    OrderItem[];
  }): Omit<Order, 'id' | 'createdAt'> & { id: undefined; createdAt: undefined } {
    const total = props.items.reduce((sum, i) => sum + i.subtotal, 0);
    return {
      id:        undefined as unknown as number,
      customer:  props.customer,
      items:     props.items,
      total,
      status:    'pending',
      createdAt: undefined as unknown as Date,
    } as any;
  }

  get itemCount(): number {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  }
}

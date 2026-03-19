export type StockStatus = 'in-stock' | 'low-stock' | 'out-stock';

/**
 * DOMAIN ENTITY — Product
 * Lógica de negocio pura, cero dependencias de framework.
 */
export class Product {
  constructor(
    public readonly id:          string,
    public          name:        string,
    public          categoryId:  string,
    public          price:       number,
    public          stock:       StockStatus,
    public          badge:       string,
    public          description: string,
    public          specs:       string[],
    public          images:      string[],
    public readonly createdAt:   Date,
    public          updatedAt:   Date,
  ) {}

  // ── Factory ──────────────────────────────────────────────────
  static create(props: Omit<Product, 'createdAt' | 'updatedAt' | 'update' | 'isAvailable'>): Product {
    const now = new Date();
    return new Product(
      props.id,
      props.name,
      props.categoryId,
      props.price,
      props.stock,
      props.badge,
      props.description,
      props.specs,
      props.images,
      now,
      now,
    );
  }

  // ── Domain behavior ──────────────────────────────────────────
  update(props: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): void {
    if (props.name        !== undefined) this.name        = props.name;
    if (props.categoryId  !== undefined) this.categoryId  = props.categoryId;
    if (props.price       !== undefined) this.price       = props.price;
    if (props.stock       !== undefined) this.stock       = props.stock;
    if (props.badge       !== undefined) this.badge       = props.badge;
    if (props.description !== undefined) this.description = props.description;
    if (props.specs       !== undefined) this.specs       = props.specs;
    if (props.images      !== undefined) this.images      = props.images;
    this.updatedAt = new Date();
  }

  isAvailable(): boolean {
    return this.stock !== 'out-stock';
  }
}

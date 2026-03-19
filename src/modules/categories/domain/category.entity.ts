/**
 * DOMAIN ENTITY — Category
 * No tiene dependencias de frameworks. Solo lógica de negocio pura.
 */
export class Category {
  constructor(
    public readonly id:          string,
    public          label:       string,
    public          icon:        string,
    public          description: string,
    public          color:       string,
    public readonly createdAt:   Date,
    public          updatedAt:   Date,
  ) {}

  // ── Factory ──────────────────────────────────────────────────
  static create(props: {
    id:          string;
    label:       string;
    icon:        string;
    description: string;
    color:       string;
  }): Category {
    const now = new Date();
    return new Category(
      props.id,
      props.label,
      props.icon,
      props.description,
      props.color,
      now,
      now,
    );
  }

  // ── Domain behavior ──────────────────────────────────────────
  update(props: Partial<Pick<Category, 'label' | 'icon' | 'description' | 'color'>>): void {
    if (props.label)       this.label       = props.label;
    if (props.icon)        this.icon        = props.icon;
    if (props.description !== undefined) this.description = props.description;
    if (props.color)       this.color       = props.color;
    this.updatedAt = new Date();
  }
}

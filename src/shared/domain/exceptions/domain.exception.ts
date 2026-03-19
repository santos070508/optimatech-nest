// ── domain.exception.ts ──────────────────────────────────────
// Base para todas las excepciones del dominio
export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

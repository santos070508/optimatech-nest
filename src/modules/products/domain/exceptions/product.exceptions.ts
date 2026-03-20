import { NotFoundException, ValidationException } from '../../../../shared/domain/exceptions/index';

export class ProductNotFoundException extends NotFoundException {
  constructor(id: string) { super('Producto', id); }
}

export class InvalidPriceException extends ValidationException {
  constructor() { super('El precio debe ser un valor positivo'); }
}

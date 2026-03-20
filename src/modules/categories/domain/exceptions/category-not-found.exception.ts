import { NotFoundException } from '../../../../shared/domain/exceptions/index';

export class CategoryNotFoundException extends NotFoundException {
  constructor(id: string) { super('Categoría', id); }
}

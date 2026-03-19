import { DomainException } from './domain.exception';

export class NotFoundException extends DomainException {
  constructor(entity: string, id: string | number) {
    super(`${entity} con id "${id}" no encontrado`);
  }
}

export class ValidationException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}

export class ConflictException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}

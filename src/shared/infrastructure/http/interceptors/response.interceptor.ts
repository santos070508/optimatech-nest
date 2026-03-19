import {
  Injectable, NestInterceptor,
  ExecutionContext, CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map }        from 'rxjs/operators';

export interface ApiResponse<T> {
  ok:   true;
  data: T;
}

/**
 * Envuelve todas las respuestas exitosas en el contrato:
 * { ok: true, data: ... }
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({ ok: true, data })),
    );
  }
}

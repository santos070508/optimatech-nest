import {
  ExceptionFilter, Catch, ArgumentsHost,
  HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException }   from '../../../domain/exceptions/domain.exception';
import { NotFoundException, ValidationException, ConflictException } from '../../../domain/exceptions/index';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const { status, message } = this.resolve(exception);
    this.logger.error(`${ctx.getRequest<Request>().method} ${ctx.getRequest<Request>().url} → ${status}`);
    ctx.getResponse<Response>().status(status).json({
      ok: false, statusCode: status, message,
      timestamp: new Date().toISOString(), path: ctx.getRequest<Request>().url,
    });
  }

  private resolve(e: unknown): { status: number; message: string } {
    if (e instanceof HttpException) {
      const r = e.getResponse();
      return { status: e.getStatus(), message: typeof r === 'string' ? r : (r as any).message };
    }
    if (e instanceof NotFoundException)    return { status: HttpStatus.NOT_FOUND,            message: (e as Error).message };
    if (e instanceof ValidationException)  return { status: HttpStatus.BAD_REQUEST,          message: (e as Error).message };
    if (e instanceof ConflictException)    return { status: HttpStatus.CONFLICT,             message: (e as Error).message };
    if (e instanceof DomainException)      return { status: HttpStatus.UNPROCESSABLE_ENTITY, message: (e as Error).message };
    return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: e instanceof Error ? e.message : 'Error interno' };
  }
}

import {
  ExceptionFilter, Catch, ArgumentsHost,
  HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException }    from '../../../domain/exceptions/domain.exception';
import {
  NotFoundException,
  ValidationException,
  ConflictException,
} from '../../../domain/exceptions/index';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx      = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request  = ctx.getRequest<Request>();
    const { status, message } = this.resolveException(exception);
    this.logger.error(`[${request.method}] ${request.url} → ${status}: ${message}`);
    response.status(status).json({
      ok: false, statusCode: status, message,
      timestamp: new Date().toISOString(), path: request.url,
    });
  }

  private resolveException(exception: unknown): { status: number; message: string } {
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      const msg = typeof res === 'string' ? res : (res as Record<string, unknown>).message as string;
      return { status: exception.getStatus(), message: msg };
    }
    if (exception instanceof NotFoundException) {
      return { status: HttpStatus.NOT_FOUND, message: (exception as Error).message };
    }
    if (exception instanceof ValidationException) {
      return { status: HttpStatus.BAD_REQUEST, message: (exception as Error).message };
    }
    if (exception instanceof ConflictException) {
      return { status: HttpStatus.CONFLICT, message: (exception as Error).message };
    }
    if (exception instanceof DomainException) {
      return { status: HttpStatus.UNPROCESSABLE_ENTITY, message: (exception as Error).message };
    }
    const msg = exception instanceof Error ? exception.message : 'Error interno del servidor';
    return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: msg };
  }
}

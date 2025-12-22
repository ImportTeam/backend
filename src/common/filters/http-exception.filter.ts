import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  private toStatusName(status: number): string {
    return (HttpStatus as any)[status] ?? 'UNKNOWN';
  }

  private normalizeErrorTypeToCode(errorType: string): string {
    const base = (errorType || 'UNKNOWN_ERROR').replace(/Exception$/i, '');
    return base
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .replace(/[\s\-]+/g, '_')
      .toUpperCase();
  }

  private toErrorCode(status: number, errorType?: string, hasValidationErrors?: boolean) {
    if (hasValidationErrors) return 'VALIDATION_ERROR';

    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'UNPROCESSABLE_ENTITY';
      default:
        break;
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) return 'INTERNAL_SERVER_ERROR';

    // fallback
    return this.normalizeErrorTypeToCode(errorType || 'UNKNOWN_ERROR');
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse: any = {
      statusCode: status,
      status: this.toStatusName(status),
      timestamp: new Date().toISOString(),
      path: (request as any).originalUrl ?? request.url,
      method: request.method,
    };

    let errorType: string | undefined;
    let details: any = undefined;
    let preferredCode: string | undefined;

    if (typeof exceptionResponse === 'object') {
      const { message, ...rest } = exceptionResponse as any;
      errorResponse.message = Array.isArray(message) ? message.join(', ') : message;
      errorType = rest.error || rest.name || exception.name;
      errorResponse.errorType = errorType || null;
      
      // Validation 에러의 경우 detailed errors 포함
      if (rest.message && Array.isArray(rest.message)) {
        errorResponse.errors = rest.message;
        details = rest.message;
      }

      // 커스텀 에러 코드가 전달된 경우 우선 적용
      if (rest.code && typeof rest.code === 'string') {
        preferredCode = rest.code;
      }

      // error: { code, message, details } 형태로 던진 경우
      if (rest.error && typeof rest.error === 'object' && rest.error.code) {
        preferredCode = rest.error.code;
        if (rest.error.details !== undefined) details = rest.error.details;
      }
    } else {
      errorResponse.message = exceptionResponse;
      errorType = exception.name;
      errorResponse.errorType = errorType || null;
    }

    const code = preferredCode || this.toErrorCode(status, errorType, Array.isArray(details));
    errorResponse.error = {
      code,
      message: errorResponse.message,
      ...(details !== undefined ? { details } : {}),
    };

    // 로그 레벨 결정
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `[${request.method}] ${request.url} - ${status}`,
        JSON.stringify(errorResponse),
        exception.stack,
      );
    } else if (status >= HttpStatus.BAD_REQUEST) {
      this.logger.warn(`[${request.method}] ${request.url} - ${status}: ${errorResponse.message}`);
    } else {
      this.logger.log(`[${request.method}] ${request.url} - ${status}`);
    }

    response.status(status).json(errorResponse);
  }
}

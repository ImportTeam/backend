import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    if (typeof exceptionResponse === 'object') {
      const { message, ...rest } = exceptionResponse as any;
      errorResponse.message = Array.isArray(message) ? message.join(', ') : message;
      errorResponse.error = rest.error || null;
      
      // Validation 에러의 경우 detailed errors 포함
      if (rest.message && Array.isArray(rest.message)) {
        errorResponse.errors = rest.message;
      }
    } else {
      errorResponse.message = exceptionResponse;
    }

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

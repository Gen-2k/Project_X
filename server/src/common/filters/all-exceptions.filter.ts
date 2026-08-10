import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus: HttpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: unknown = 'Internal server error';

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'object' && response !== null && 'message' in response) {
        message = (response as Record<string, unknown>).message;
      } else {
        message = response;
      }
    } else {
      this.logger.error('Unhandled Exception caught by AllExceptionsFilter', exception);
    }

    if (httpStatus >= HttpStatus.INTERNAL_SERVER_ERROR && exception instanceof HttpException) {
      this.logger.error(`HttpException ${httpStatus}`, exception.stack);
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: String(httpAdapter.getRequestUrl(ctx.getRequest<object>())),
      message,
    };

    httpAdapter.reply(ctx.getResponse<object>(), responseBody, httpStatus);
  }
}

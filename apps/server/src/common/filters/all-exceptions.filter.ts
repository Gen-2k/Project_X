import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus: HttpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: unknown = 'Internal server error';

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'object' && response !== null && 'message' in response) {
        message = (response as Record<string, unknown>)['message'];
      } else {
        message = response;
      }
    } else {
      this.logger.error({ err: exception }, 'Unhandled exception caught by AllExceptionsFilter');
    }

    if (httpStatus >= HttpStatus.INTERNAL_SERVER_ERROR && exception instanceof HttpException) {
      this.logger.error({ err: exception }, `HttpException ${httpStatus}`);
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

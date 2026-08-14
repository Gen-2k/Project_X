import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let httpAdapterHost: HttpAdapterHost;
  let logger: { error: jest.Mock };
  let replyMock: jest.Mock;
  let getRequestUrlMock: jest.Mock;
  let hostMock: ArgumentsHost;

  beforeEach(() => {
    replyMock = jest.fn();
    getRequestUrlMock = jest.fn().mockReturnValue('/api/v1/test');

    httpAdapterHost = {
      httpAdapter: {
        getRequestUrl: getRequestUrlMock,
        reply: replyMock,
      },
    } as unknown as HttpAdapterHost;

    logger = {
      error: jest.fn(),
    };

    hostMock = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ url: '/api/v1/test' }),
        getResponse: jest.fn().mockReturnValue({}),
      }),
    } as unknown as ArgumentsHost;

    filter = new AllExceptionsFilter(httpAdapterHost, logger as unknown as Logger);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should format HttpException with object response properly', () => {
    const httpException = new HttpException(
      { message: ['Email is invalid', 'Password is too short'], error: 'Bad Request' },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(httpException, hostMock);

    expect(replyMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        path: '/api/v1/test',
        message: ['Email is invalid', 'Password is too short'],
      }),
      HttpStatus.BAD_REQUEST,
    );
  });

  it('should format HttpException with string response properly', () => {
    const httpException = new HttpException('Resource not found', HttpStatus.NOT_FOUND);

    filter.catch(httpException, hostMock);

    expect(replyMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        statusCode: HttpStatus.NOT_FOUND,
        path: '/api/v1/test',
        message: 'Resource not found',
      }),
      HttpStatus.NOT_FOUND,
    );
  });

  it('should log 500 HttpException as an error', () => {
    const serverException = new HttpException('Service unavailable', HttpStatus.BAD_GATEWAY);

    filter.catch(serverException, hostMock);

    expect(logger.error).toHaveBeenCalledWith(
      { err: serverException },
      `HttpException ${HttpStatus.BAD_GATEWAY}`,
    );
    expect(replyMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        statusCode: HttpStatus.BAD_GATEWAY,
      }),
      HttpStatus.BAD_GATEWAY,
    );
  });

  it('should sanitize unexpected non-HttpException errors and return 500 Internal Server Error', () => {
    const unexpectedError = new Error('Database connection crashed');

    filter.catch(unexpectedError, hostMock);

    expect(logger.error).toHaveBeenCalledWith(
      { err: unexpectedError },
      'Unhandled exception caught by AllExceptionsFilter',
    );
    expect(replyMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        path: '/api/v1/test',
        message: 'Internal server error',
      }),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });
});

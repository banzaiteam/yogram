import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

// https://docs.nestjs.com/exception-filters
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error = exception.getResponse()['error'];

    if (host.getType<string>() === 'graphql') {
      const status = exception.getStatus();
      const responseBody: any = exception.getResponse();
      throw new HttpException(
        {
          statusCode: status,
          message: Array.isArray(responseBody.message)
            ? responseBody.message
            : [responseBody.message],
        },
        status,
      );
    }

    response.status(status).json({
      message: exception.message,
      error,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

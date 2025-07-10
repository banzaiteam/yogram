import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error = exception.getResponse();

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

    // we get error['response'] only when catch error from stream response(example: posts/create)
    response.status(status).json({
      message: !error['response']
        ? exception.message
        : JSON.parse(error['response'].stream).message,
      // need custom error message handle because of  posts streaming response
      error: !error['response'] ? error['error'] : exception.message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

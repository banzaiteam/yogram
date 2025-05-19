import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { Response } from 'express';
import { HTTP_ERROR } from '../../constants/http-exeptions.constant';
import { extractFromText } from '../../utils/regex.util';

@Catch(EntityNotFoundError)
export class NotFoundFilter implements ExceptionFilter {
  private readonly regEx = /type\s\"(\w+)\"/;

  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    console.log('EntityNotFoundError-EntityNotFoundError-EntityNotFoundError');

    const res = host.switchToHttp().getResponse<Response>();
    const { status, error } = HTTP_ERROR.NOT_FOUND;
    const entity = this.extractMessageData(exception.message);
    res.status(status).json({ statusCode: status, entity, error });
  }

  private extractMessageData(message: string) {
    const entity = extractFromText(message, this.regEx);
    return { entity };
  }
}

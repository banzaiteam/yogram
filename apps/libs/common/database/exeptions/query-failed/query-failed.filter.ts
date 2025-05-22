import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { HTTP_ERROR, HttpError } from '../../constants/http-exeptions.constant';
import { BaseExceptionFilter } from '@nestjs/core';

import { extractFromText } from '../../utils/regex.util';
import { IDatabaseError } from '../database-error.interface';

@Catch(QueryFailedError)
export class QueryFailedFilter extends BaseExceptionFilter {
  private readonly FIELD_NAME_REGEX = /Key \((\w+)\)=/;
  private readonly FIELD_VALUE_REGEX = /\)=\((.*?)\)/;

  catch(exception: IDatabaseError, host: ArgumentsHost) {
    // console.log('=>(query-failed.filter.ts:14) exception', exception);
    const response = host.switchToHttp().getResponse();
    const { code, detail, table } = exception;
    const { httpError, description } = this.createErrorData(code, detail);

    if (!httpError) {
      return super.catch(exception, host);
    }
    const { status, error } = httpError;
    const { fieldName, fieldValue } = this.extractMessageData(detail);
    const meta = { description, fieldName, fieldValue, table };
    response
      .status(status)
      .json({ statusCode: status, message: detail, error, meta });
  }

  private extractMessageData(message: string) {
    const fieldName = extractFromText(message, this.FIELD_NAME_REGEX);
    const fieldValue = extractFromText(message, this.FIELD_VALUE_REGEX);
    return { fieldName, fieldValue };
  }

  private createErrorData(code: string, message: string) {
    let httpError: HttpError;
    let description: string;

    switch (code) {
      case this.DatabaseErrorCode.ASSOCIATION_NOT_FOUND_OR_NOT_NULL_VIOLATION:
        if (message.includes(this.MessageSnippets.ASSOCIATION_NOT_FOUND)) {
          httpError = HTTP_ERROR.NOT_FOUND;
          description = this.Description.NOT_NULL_VIOLATION;
        } else if (message.includes(this.MessageSnippets.NOT_NULL_VIOLATION)) {
          httpError = HTTP_ERROR.CONFLICT;
          description = this.Description.NOT_NULL_VIOLATION;
        }
        break;
      case this.DatabaseErrorCode.UNIQUE_VIOLATION:
        httpError = HTTP_ERROR.CONFLICT;
        description = this.Description.UNIQUE_VIOLATION;
        break;
    }
    return { httpError, description };
  }

  private readonly DatabaseErrorCode = {
    ASSOCIATION_NOT_FOUND_OR_NOT_NULL_VIOLATION: '23503',
    UNIQUE_VIOLATION: '23505',
  } as const satisfies Record<string, string>;

  private readonly MessageSnippets = {
    ASSOCIATION_NOT_FOUND: 'is not present',
    NOT_NULL_VIOLATION: 'is still referenced',
  } as const satisfies Record<string, string>;

  private readonly Description = {
    ASSOCIATION_NOT_FOUND: 'is not present',
    NOT_NULL_VIOLATION: 'cannot delete due to Not Null constraint',
    UNIQUE_VIOLATION: 'Unique constraint',
  } as const satisfies Record<string, string>;
}

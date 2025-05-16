import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export class HashPasswordPipe implements PipeTransform {
  async transform(value: object, metadata: ArgumentMetadata) {
    if (
      !Object.prototype.hasOwnProperty.call(value, 'password') ||
      value['password'] === undefined
    ) {
      throw new BadRequestException('password was not provided');
    }
    value['password'] = await bcrypt.hash(value['password'], 10);
    return value;
  }
}

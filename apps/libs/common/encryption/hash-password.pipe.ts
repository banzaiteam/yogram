import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import * as argon2 from 'argon2';

export class HashPasswordPipe implements PipeTransform {
  async transform(value: object, metadata: ArgumentMetadata) {
    if (
      !Object.prototype.hasOwnProperty.call(value, 'password') ||
      value['password'] === undefined
    ) {
      throw new BadRequestException('password was not provided');
    }
    value['password'] = await argon2.hash(value['password']);
    console.log(
      "🚀 ~ HashPasswordPipe ~ transform ~ value['password']:",
      value['password'],
    );

    return value;
  }
}

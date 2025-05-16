import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const EventSubscribe = (meta: any): CustomDecorator =>
  SetMetadata('AMQP_SUBSCRIBER', meta);

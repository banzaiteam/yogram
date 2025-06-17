import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

type Direction = 'asc' | 'desc';

export interface Sorting {
  property: string;
  direction: Direction;
}

export const sortFactory = (validParams: string[], ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  const sort = request.query?.sort as string;
  if (!sort) return null;
  const sortPattern = /^([a-zA-Z0-9]+):(asc|desc)$/;
  if (!sort.match(sortPattern))
    throw new BadRequestException('Invalid sort parameter');
  const [property, direction] = sort.split(':');
  if (!validParams.includes(property))
    throw new BadRequestException('Invalid property params');
  return { property, direction };
};

export const SortingParams = createParamDecorator(sortFactory);

export const getSortingOrder = (sorting: Sorting) => {
  return sorting ? { [sorting.property.toString()]: sorting.direction } : {};
};

import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { Equal } from 'typeorm';

export interface IFiltering {
  filterProperty: string;
  rule: string;
  value: string;
}

// valid filter rules
export enum FilterRule {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUALS = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUALS = 'lte',
  LIKE = 'like',
  NOT_LIKE = 'nlike',
  IN = 'in',
  NOT_IN = 'nin',
  IS_NULL = 'isnull',
  IS_NOT_NULL = 'isnotnull',
}

const rulesMapping = (rule: string, value: string) => {
  switch (rule) {
    case 'eq':
      return Equal(value);
    default:
      return null;
  }
};

export const filteringFactory = (data, ctx: ExecutionContext): IFiltering => {
  const req: Request = ctx.switchToHttp().getRequest();
  const filter = req.query?.filter as string;
  if (!filter) return null;
  if (!Array.isArray(data))
    throw new BadRequestException('Invalid filter parameter');

  if (
    !filter.match(
      /^[a-zA-Z0-9_]+:(eq|neq|gt|gte|lt|lte|like|nlike|in|nin):[a-zA-Z0-9-_,]+$/,
    )
  ) {
    throw new BadRequestException('Invalid filter parameter');
  }

  // extract the parameters and validate if the rule and the filterProperty are valid
  const [filterProperty, rule, value] = filter.split(':');

  if (!data.includes(filterProperty))
    throw new BadRequestException(
      `Invalid filter filterProperty: ${filterProperty}`,
    );
  if (!Object.values(FilterRule).includes(rule as FilterRule))
    throw new BadRequestException(`Invalid filter rule: ${rule}`);

  return { filterProperty, rule, value };
};

export const FilteringParams = createParamDecorator(filteringFactory);

export const getFilteringObject = (filtering: IFiltering) => {
  const filter = rulesMapping(filtering.rule, filtering.value);
  return filtering ? { [filtering.filterProperty]: filter } : {};
};

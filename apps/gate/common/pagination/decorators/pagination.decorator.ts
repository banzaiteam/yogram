import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IPagination {
  page: number;
  limit: number;
  offset: number;
}

export const paginationFactory = (
  data: any,
  context: ExecutionContext,
): IPagination => {
  const request = context.switchToHttp().getRequest();
  let page = parseInt(request.query?.page as string);
  let limit = parseInt(request.query?.limit as string);
  isNaN(page) || page < 1 ? (page = 1) : page;
  isNaN(limit) || limit < 1 ? (limit = 1) : limit;
  const offset = page * limit - limit;
  return { page, limit, offset };
};

export const PaginationParams = createParamDecorator(paginationFactory);

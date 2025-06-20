import { ValidateNested } from 'class-validator';

export class IPaginatedResponse<T> {
  items: T[];
  totalItems: number;
  page: number;
  limit: number;
}

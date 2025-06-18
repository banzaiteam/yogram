export interface IPaginatedResponse<T> {
  items: T[];
  totalItems: number;
  page: number;
  limit: number;
}

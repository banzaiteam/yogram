import { Injectable } from '@nestjs/common';
import { HttpPostsPath } from '../../../libs/Posts/constants/path.enum';
import { HttpServices } from 'apps/gate/common/constants/http-services.enum';
import { IPagination } from 'apps/gate/common/pagination/decorators/pagination.decorator';
import { GateService } from 'apps/libs/gateService';
import { ISorting } from 'apps/gate/common/pagination/decorators/sorting.decorator';
import { IFiltering } from 'apps/gate/common/pagination/decorators/filtering.decorator';

@Injectable()
export class PostsService {
  constructor(private readonly gateService: GateService) {}

  async get(
    id: string,
    pagination: IPagination,
    sorting: ISorting,
    filtering: IFiltering,
  ) {
    const path = [
      HttpPostsPath.Get,
      `${id}?page=${pagination.page}&limit=${pagination.limit}&sort=${sorting.property}:${sorting.direction}&filter=${filtering.filterProperty}:${filtering.rule}:${filtering.value}`,
    ].join('/');
    return await this.gateService.requestHttpServiceGet(
      HttpServices.Posts,
      path,
      {},
    );
  }
}

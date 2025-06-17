import { Injectable } from '@nestjs/common';
import { HttpPostsPath } from '../../../libs/Posts/constants/path.enum';
import { HttpServices } from 'apps/gate/common/constants/http-services.enum';
import { Filtering } from 'apps/gate/common/pagination/decorators/filtering.decorator';
import { IPagination } from 'apps/gate/common/pagination/decorators/pagination.decorator';
import { Sorting } from 'apps/gate/common/pagination/decorators/sorting.decorator';
import { GateService } from 'apps/libs/gateService';

@Injectable()
export class PostsService {
  constructor(private readonly gateService: GateService) {}

  async get(
    id: string,
    pagination: IPagination,
    sorting: Sorting,
    filtering: Filtering,
  ) {
    const path = [
      HttpPostsPath.Get,
      `${id}?page=${pagination.page}&limit=${pagination.limit}&sort=${sorting.property}:${sorting.direction}&filter=${filtering.property}:${filtering.rule}:${filtering.value}`,
    ].join('/');
    return await this.gateService.requestHttpServiceGet(
      HttpServices.Posts,
      path,
      {},
    );
  }
}

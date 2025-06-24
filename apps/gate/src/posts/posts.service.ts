import { Injectable } from '@nestjs/common';
import { HttpPostsPath } from '../../../libs/Posts/constants/path.enum';
import { HttpServices } from '../../../../apps/gate/common/constants/http-services.enum';
import { IPagination } from '../../../libs/common/pagination/decorators/pagination.decorator';
import { GateService } from '../../../../apps/libs/gateService';
import { ISorting } from '../../../libs/common/pagination/decorators/sorting.decorator';
import { IFiltering } from '../../../libs/common/pagination/decorators/filtering.decorator';
import { PostPaginatedResponseDto } from 'apps/libs/Posts/dto/output/post-paginated-reponse.dto';

@Injectable()
export class PostsService {
  constructor(private readonly gateService: GateService) {}

  async get(
    pagination: IPagination,
    sorting?: ISorting,
    filtering?: IFiltering,
  ): Promise<PostPaginatedResponseDto> {
    const path = [
      HttpPostsPath.Get,
      `?page=${pagination.page}&limit=${pagination.limit}${sorting ? `&sort=${sorting.property}:${sorting.direction}` : ''}${filtering ? `&filter=${filtering?.filterProperty}:${filtering?.rule}:${filtering?.value}` : ''}`,
    ].join('/');
    return await this.gateService.requestHttpServiceGet(
      HttpServices.Posts,
      path,
      {},
    );
  }

  async delete(id: string) {
    const path = [HttpPostsPath.Delete, id].join('/');
    return await this.gateService.requestHttpServiceGet(
      HttpServices.Posts,
      path,
      {},
    );
  }
}

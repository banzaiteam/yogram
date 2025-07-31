import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { HttpPostsPath } from '../../../libs/Posts/constants/path.enum';
import { HttpServices } from '../../../../apps/gate/common/constants/http-services.enum';
import { IPagination } from '../../../libs/common/pagination/decorators/pagination.decorator';
import { GateService } from '../../../../apps/libs/gateService';
import { ISorting } from '../../../libs/common/pagination/decorators/sorting.decorator';
import { IFiltering } from '../../../libs/common/pagination/decorators/filtering.decorator';
import { PostPaginatedResponseDto } from 'apps/libs/Posts/dto/output/post-paginated-reponse.dto';
import { UpdatePostDto } from '../../../../apps/libs/Posts/dto/input/update-post.dto';
import { CancelUploadDto } from '../../../../apps/libs/Posts/dto/input/cancel-upload.dto';
import { UsersService } from '../users/users.service';
import { ResponsePostsMainPage } from 'apps/libs/Posts/dto/output/response-posts-main-page.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PostsService {
  constructor(
    private readonly gateService: GateService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

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

  async main(
    pagination: IPagination,
    sorting: ISorting,
    filtering: IFiltering,
    id?: string,
  ): Promise<ResponsePostsMainPage> {
    const [posts, usersAmount] = await Promise.all([
      this.get(pagination, sorting, filtering),
      this.usersService.usersAmount(),
    ]);
    if (!id) {
      const responsePostsMainPage: ResponsePostsMainPage = {
        posts: posts.items,
        usersAmount,
      };
      return plainToInstance(ResponsePostsMainPage, responsePostsMainPage);
    }
    if (id) {
      const [subscriptions, subscribers] = await Promise.all([
        this.usersService.getAllSubscriptions(id),
        this.usersService.getAllSubscribers(id),
      ]);
      const responsePostsMainPage: ResponsePostsMainPage = {
        posts: posts.items,
        usersAmount,
        subscriptions: subscriptions.amount,
        subscribers: subscribers.amount,
      };
      return plainToInstance(ResponsePostsMainPage, responsePostsMainPage);
    }
  }

  async cancelUpload(cancelUploadDto: CancelUploadDto) {
    return await this.gateService.requestHttpServicePost(
      HttpServices.Posts,
      HttpPostsPath.Cancel,
      cancelUploadDto,
      {},
    );
  }

  async delete(userId: string, postId: string) {
    const path = [HttpPostsPath.Delete, userId, postId].join('/');
    return await this.gateService.requestHttpServiceDelete(
      HttpServices.Posts,
      path,
      {},
    );
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<void> {
    return this.gateService.requestHttpServicePatch(
      HttpServices.Posts,
      HttpPostsPath.Update,
      { criteria: id, updatePostDto },
      {},
    );
  }
}

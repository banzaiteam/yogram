import { Injectable } from '@nestjs/common';
import { GateService } from '../../../../apps/libs/gateService';
import { CreateUserDto } from '../../../libs/Users/dto/user/create-user.dto';
import { HttpUsersPath } from '../../../libs/Users/constants/path.enum';
import { ResponseUserDto } from '../../../../apps/libs/Users/dto/user/response-user.dto';
import { FindUserByCriteriaDto } from '../../../../apps/libs/Users/dto/user/find-user-criteria.dto';
import { UpdateUserDto } from '../../../../apps/libs/Users/dto/user/update-user.dto';
import { UpdateUserCriteria } from '../../../../apps/libs/Users/dto/user/update-user-criteria.dto';
import { ResponseProviderDto } from '../../../../apps/libs/Users/dto/provider/response-provider.dto';
import { HttpServices } from '../../../../apps/gate/common/constants/http-services.enum';
import { IPagination } from '../../../../apps/libs/common/pagination/decorators/pagination.decorator';
import { ISorting } from '../../../../apps/libs/common/pagination/decorators/sorting.decorator';
import { IFiltering } from '../../../../apps/libs/common/pagination/decorators/filtering.decorator';
import { PostsService } from '../posts/posts.service';
import { plainToInstance } from 'class-transformer';
import { ResponseProfilePageDto } from '../../../../apps/libs/Users/dto/profile/response-profile-page.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly gateService: GateService,
    private readonly postsService: PostsService,
  ) {}

  async findUserByCriteria(
    findUserByCriteriaDto: FindUserByCriteriaDto,
  ): Promise<ResponseUserDto | null> {
    const queryString = this.makeQueryStringFromObject(findUserByCriteriaDto);
    const path = `${HttpUsersPath.FindUserByCriteria}?${queryString}`;
    return await this.gateService.requestHttpServiceGet(
      HttpServices.Users,
      path,
      {},
    );
  }

  async findUserByProviderId(
    providerId: string,
  ): Promise<ResponseUserDto | null> {
    const path = `${HttpUsersPath.FindUserByProviderId}/${providerId}`;
    console.log('🚀 ~ UsersService ~ path:', path);
    return await this.gateService.requestHttpServiceGet(
      HttpServices.Users,
      path,
      {},
    );
  }

  async findProviderByProviderId(
    providerId: string,
  ): Promise<ResponseProviderDto | null> {
    const path = `${HttpUsersPath.FindProviderByProviderId}/${providerId}`;
    return await this.gateService.requestHttpServiceGet(
      HttpServices.Users,
      path,
      {},
    );
  }

  async create(createUserDto: CreateUserDto): Promise<void> {
    console.log('HttpServices.Users', HttpServices.Users);

    await this.gateService.requestHttpServicePost(
      HttpServices.Users,
      HttpUsersPath.Create,
      createUserDto,
      {},
    );
  }

  async update(
    criteria: UpdateUserCriteria,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    return await this.gateService.requestHttpServicePatch(
      HttpServices.Users,
      HttpUsersPath.UpdateUserByCriteria,
      { criteria, updateUserDto },
      {},
    );
  }

  async profilePage(
    id: string,
    pagination: IPagination,
    sorting: ISorting,
    filtering: IFiltering,
  ): Promise<ResponseProfilePageDto> {
    const user = await this.findUserByCriteria({ id });
    const posts = await this.postsService.get(pagination, sorting, filtering);
    return plainToInstance(ResponseProfilePageDto, { user, posts });
  }

  makeQueryStringFromObject(query: object): string {
    const objectWithoutUndefined = JSON.parse(JSON.stringify(query));
    return Object.entries(objectWithoutUndefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }
}

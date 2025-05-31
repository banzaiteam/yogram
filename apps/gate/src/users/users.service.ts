import { Injectable } from '@nestjs/common';
import { GateService } from '../../../../apps/libs/gateService';
import { CreateUserDto } from '../../../libs/Users/dto/user/create-user.dto';
import { HttpUsersPath } from '../../../libs/Users/constants/path.enum';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';
import { FindUserByCriteriaDto } from 'apps/libs/Users/dto/user/find-user-criteria.dto';
import { UpdateUserDto } from 'apps/libs/Users/dto/user/update-user.dto';
import { UpdateUserCriteria } from 'apps/libs/Users/dto/user/update-user-criteria.dto';
import { ResponseProviderDto } from 'apps/libs/Users/dto/provider/response-provider.dto';

@Injectable()
export class UsersService {
  constructor(private readonly gateService: GateService) {}

  async findUserByCriteria(
    findUserByCriteriaDto: FindUserByCriteriaDto,
  ): Promise<ResponseUserDto | null> {
    const queryString = this.makeQueryStringFromObject(findUserByCriteriaDto);
    const path = `${HttpUsersPath.FindUserByCriteria}?${queryString}`;
    return await this.gateService.usersHttpServiceGet(path, {});
  }

  async findUserByProviderId(
    providerId: string,
  ): Promise<ResponseUserDto | null> {
    const path = `${HttpUsersPath.FindUserByProviderId}/${providerId}`;
    console.log('🚀 ~ UsersService ~ path:', path);
    return await this.gateService.usersHttpServiceGet(path, {});
  }

  async findProviderByProviderId(
    providerId: string,
  ): Promise<ResponseProviderDto | null> {
    const path = `${HttpUsersPath.FindProviderByProviderId}/${providerId}`;
    return await this.gateService.usersHttpServiceGet(path, {});
  }

  async create(createUserDto: CreateUserDto): Promise<void> {
    await this.gateService.usersHttpServicePost(
      HttpUsersPath.Create,
      createUserDto,
      {},
    );
  }

  async update(
    criteria: UpdateUserCriteria,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    return await this.gateService.usersHttpServicePatch(
      HttpUsersPath.UpdateUserByCriteria,
      { criteria, updateUserDto },
      {},
    );
  }

  makeQueryStringFromObject(query: object): string {
    const objectWithoutUndefined = JSON.parse(JSON.stringify(query));
    return Object.entries(objectWithoutUndefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }
}

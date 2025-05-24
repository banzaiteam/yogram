import { Injectable } from '@nestjs/common';
import { GateService } from '../../../../apps/libs/gateService';
import { CreateUserDto } from '../../../libs/Users/dto/user/create-user.dto';
import { HttpUsersPath } from '../../../libs/Users/constants/path.enum';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';
import { FindUserByCriteriaDto } from 'apps/libs/Users/dto/user/find-user-criteria.dto';

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

  async create(createUserDto: CreateUserDto): Promise<void> {
    await this.gateService.usersHttpServicePost(
      HttpUsersPath.Create,
      createUserDto,
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

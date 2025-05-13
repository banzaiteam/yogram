import { Injectable } from '@nestjs/common';
import { GateService } from '../../../../apps/libs/gateService';
import { CreateUserDto } from '../../../libs/Users/dto/user/create-user.dto';
import { HttpUsersPath } from '../../../libs/Users/constants/path.enum';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';
import path from 'path';

@Injectable()
export class UsersService {
  constructor(private readonly gateService: GateService) {}

  async find(id: string): Promise<ResponseUserDto> {
    return await this.gateService.usersHttpServiceGet(
      path.join(HttpUsersPath.Find, id),
      {},
    );
  }

  async create(createUserDto: CreateUserDto): Promise<void> {
    await this.gateService.usersHttpServicePost(
      HttpUsersPath.Create,
      createUserDto,
      {},
    );
  }
}

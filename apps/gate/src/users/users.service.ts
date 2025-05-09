import { Injectable } from '@nestjs/common';
import { GateService } from 'apps/libs/gateService';
import { CreateUserDto } from '../../../libs/Users/dto/create-user.dto';
import { HttpUsersPath } from '../../../libs/Users/constants/path.enum';

@Injectable()
export class UsersService {
  constructor(private readonly gateService: GateService) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    await this.gateService.usersHttpServicePost(
      HttpUsersPath.Create,
      createUserDto,
      {},
    );
  }
}

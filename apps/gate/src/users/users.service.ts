import { Injectable } from '@nestjs/common';
import { GateService } from 'apps/libs/gateService';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersPath } from './constants/path.enum';

@Injectable()
export class UsersService {
  constructor(private readonly gateService: GateService) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    this.gateService.usersHttpServicePost(UsersPath.Create, createUserDto, {});
  }
}

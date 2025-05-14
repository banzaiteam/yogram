import { Injectable } from '@nestjs/common';
import { GateService } from '../../../../apps/libs/gateService';
import { HttpUsersPath } from '../../../../apps/libs/Users/constants/path.enum';
import { CreateUserDto } from '../../../../apps/libs/Users/dto/user/create-user.dto';

@Injectable()
export class SignupService {
  constructor(private readonly gateService: GateService) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    await this.gateService.usersHttpServicePost(
      HttpUsersPath.Create,
      createUserDto,
      {},
    );
  }
}

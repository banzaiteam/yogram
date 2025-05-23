import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GateService } from '../../../../apps/libs/gateService';
import { HttpUsersPath } from '../../../../apps/libs/Users/constants/path.enum';
import { CreateUserDto } from '../../../../apps/libs/Users/dto/user/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SignupService {
  constructor(
    private readonly gateService: GateService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    await this.gateService.usersHttpServicePost(
      HttpUsersPath.Create,
      createUserDto,
      {},
    );
  }

  async emailVerify(token: string): Promise<void> {
    let email: object;
    email = await this.jwtService.verifyAsync(token);
    delete email['iat'];
    delete email['exp'];
    await this.gateService.usersHttpServicePost(
      HttpUsersPath.EmailVerify,
      email['email'],
      {},
    );
  }
}

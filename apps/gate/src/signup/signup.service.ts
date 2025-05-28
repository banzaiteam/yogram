import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { GateService } from '../../../../apps/libs/gateService';
import { HttpUsersPath } from '../../../../apps/libs/Users/constants/path.enum';
import { CreateUserDto } from '../../../../apps/libs/Users/dto/user/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailDto } from 'apps/libs/Users/dto/user/email.dto';
import { UsersService } from '../users/users.service';
import { ProducerService } from 'apps/libs/common/message-brokers/rabbit/providers/producer.service';
import { UsersRoutingKeys } from 'apps/users/src/message-brokers/rabbit/users-routing-keys.constant';
import { UserVerifyEmailDto } from 'apps/libs/Users/dto/user/user-verify-email.dto';
import { GoogleSignupDto } from 'apps/libs/Users/dto/user/google-signup.dto';
import { MergeProviderUserDto } from 'apps/libs/Users/dto/user/merge-provider-user.dto';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';
import { GoogleResponse } from 'apps/users/src/users-command.service';

@Injectable()
export class SignupService {
  constructor(
    private readonly gateService: GateService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly producerService: ProducerService,
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

  async sendVerifyEmail(email: EmailDto) {
    const user = await this.usersService.findUserByCriteria(email);
    if (!user) {
      throw new UnauthorizedException('user was not found');
    }
    if (user.verified)
      throw new BadRequestException('user is already verified');
    const userVerifyEmailDto: UserVerifyEmailDto = {
      username: user.username,
      to: user.email,
    };
    try {
      await this.producerService.emit({
        routingKey: UsersRoutingKeys.UsersVerifyEmail,
        payload: userVerifyEmailDto,
      });
    } catch (err) {
      throw new InternalServerErrorException('verify email was not sent');
    }
  }
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoggedUserDto } from 'apps/libs/Users/dto/user/logged-user.dto';
import { EmailDto } from 'apps/libs/Users/dto/user/email.dto';
import { ProducerService } from 'apps/libs/common/message-brokers/rabbit/providers/producer.service';
import { UsersRoutingKeys } from 'apps/users/src/message-brokers/rabbit/users-routing-keys.constant';
import { RestorePasswordDto } from 'apps/libs/Users/dto/user/restore-password.dto';
import { getForgotPasswordTemplate } from './html-templates/forgot-password.template';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly producerService: ProducerService,
  ) {}

  async login(user: LoggedUserDto): Promise<string[]> {
    const payloadAccess = { id: user.id };
    const payloadRefresh = { id: user.id };
    const access_token = await this.genAccessToken(payloadAccess);
    const refresh_token = await this.genRefreshToken(payloadRefresh);
    return [access_token, refresh_token];
  }

  async genAccessToken(payload: object): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES'),
    });
  }

  async genRefreshToken(payload: object): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES'),
    });
  }

  async refresh(id: string) {
    //check if user not deleted
    const user = await this.usersService.findUserByCriteria({ id });
    if (!user) throw new UnauthorizedException();
    const payloadAccess = { id: user.id };
    return await this.genAccessToken(payloadAccess);
  }

  async forgotPassword(email: EmailDto) {
    const user = await this.usersService.findUserByCriteria(email);
    if (!user) {
      throw new UnauthorizedException('user was not found');
    }
    if (!user.verified) throw new BadRequestException('user is not verified');
    const payload = { email: user.email };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('FORGOT_PASSWORD_TOKEN_EXPIRES'),
    });

    const template = getForgotPasswordTemplate(user.username, token);
    const subject = 'Yogram password restore';
    let restorePasswordDto: RestorePasswordDto = {
      to: user.email,
      username: user.username,
      template,
      subject,
    };
    try {
      await this.producerService.emit({
        routingKey: UsersRoutingKeys.SendEmail,
        payload: restorePasswordDto,
      });
    } catch (err) {
      throw new InternalServerErrorException(
        'forgot password email was not sent',
      );
    }
  }

  restorePassword(email: EmailDto) {
    throw new Error('Method not implemented.');
  }
}

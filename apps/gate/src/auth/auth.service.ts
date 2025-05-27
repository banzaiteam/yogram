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

import { getForgotPasswordTemplate } from './html-templates/forgot-password.template';
import { RestorePasswordEmailDto } from 'apps/libs/Users/dto/user/restore-password-email.dto';
import { RestorePasswordDto } from 'apps/libs/Users/dto/user/restore-password.dto';
import { UpdateUserCriteria } from 'apps/libs/Users/dto/user/update-user-criteria.dto';
import { UpdateUserDto } from 'apps/libs/Users/dto/user/update-user.dto';
import { GateService } from 'apps/libs/gateService';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Response } from 'express';
import { SignupService } from '../signup/signup.service';
import { GoogleSignupDto } from 'apps/libs/Users/dto/user/google-signup.dto';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly producerService: ProducerService,
    private readonly gateService: GateService,
    private readonly httpService: HttpService,
    private readonly signupService: SignupService,
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
      throw new UnauthorizedException('User with this email doesnt exist');
    }
    if (!user.verified) throw new BadRequestException('user is not verified');
    const payload = { email: user.email };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('FORGOT_PASSWORD_TOKEN_EXPIRES'),
    });

    const template = getForgotPasswordTemplate(user.username, token);
    const subject = 'Yogram password restore';
    let restorePasswordDto: RestorePasswordEmailDto = {
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

  async restorePage(token: string) {
    return await this.jwtService.verifyAsync(token);
  }

  async restorePassword(restorePasswordDto: RestorePasswordDto): Promise<void> {
    const criteria: UpdateUserCriteria = { email: restorePasswordDto.email };
    const updateUserDto: UpdateUserDto = {
      password: restorePasswordDto.password,
    };
    return this.usersService.update(criteria, updateUserDto);
  }

  async google(code: string, res: Response) {
    const tokenResponse = await this.gateService.httpServicePost(
      'https://oauth2.googleapis.com/token',
      {
        code: code,
        client_id: this.configService.get('GOOGLE_CLIENT_ID'),
        client_secret: this.configService.get('GOOGLE_CLIENT_SECRET'),
        redirect_uri: this.configService.get('GOOGLE_REDIRECT_URI'),
        grant_type: 'authorization_code',
      },
      {},
    );
    const accessToken = tokenResponse.access_token;
    const userResponse = await lastValueFrom(
      this.httpService.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );
    const userData = userResponse.data;
    console.log('🚀 ~ AuthService ~ google ~ userData:', userData);
    // todo replace with function findProviderBySUB
    const userByProviderId = await this.usersService.findUserByProviderId(
      userData.sub,
    );
    const provider = await this.usersService.findProviderByProviderId('1234');
    console.log('🚀 ~ provider:', provider);
    // todo need to check if we have a googleId(need func findByProviderId) in the Provider, if yes need to compare with userData, if equel need login
    // if we have not classically registered user we should create it from google's provider data(gen username, assign email)
    // but if we have should merge form user to provider
    if (!provider) {
      const user = await this.usersService.findUserByCriteria({
        email: userData.email,
      });
      console.log('auth: no provider');

      let googleSignupDto: GoogleSignupDto;
      if (!user) {
        console.log('auth: no user');
        googleSignupDto = {
          providerId: userData.sub,
          username: userData.name,
          email: userData.email,
        };
      } else {
        console.log('auth: user exists');
        googleSignupDto = {
          providerId: userData.sub,
          username: userData.name,
          email: userData.email,
          user: { email: userData.email, username: userData.name },
        };
      }
      const res = await this.signupService.signUpGoogle(googleSignupDto);
      console.log('🚀 ~ AuthService ~ google ~ res:', res);
      // Login
    } else {
      console.log('auth: provider exists we login');
      const userResponse: ResponseUserDto = userByProviderId;
      const payloadAccess = { id: userByProviderId.id };
      const payloadRefresh = { id: userByProviderId.id };
      const access_token = await this.genAccessToken(payloadAccess);
      const refresh_token = await this.genRefreshToken(payloadRefresh);
      return [access_token, refresh_token, userResponse];
    }
  }
}

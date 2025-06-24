import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoggedUserDto } from '../../../../apps/libs/Users/dto/user/logged-user.dto';
import { EmailDto } from 'apps/libs/Users/dto/user/email.dto';
import { ProducerService } from '../../../../apps/libs/common/message-brokers/rabbit/providers/producer.service';
import { UsersRoutingKeys } from '../../../../apps/users/src/message-brokers/rabbit/users-routing-keys.constant';
import { getForgotPasswordTemplate } from './html-templates/forgot-password.template';
import { RestorePasswordEmailDto } from '../../../../apps/libs/Users/dto/user/restore-password-email.dto';
import { RestorePasswordDto } from '../../../../apps/libs/Users/dto/user/restore-password.dto';
import { UpdateUserCriteria } from '../../../../apps/libs/Users/dto/user/update-user-criteria.dto';
import { UpdateUserDto } from '../../../../apps/libs/Users/dto/user/update-user.dto';
import { GateService } from '../../../../apps/libs/gateService';
import { HttpService } from '@nestjs/axios';
import { SignupService } from '../signup/signup.service';
import { GoogleOauth } from './oauth/google.oauth';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';
import { SessionProvider } from './session/session.provider';
import { Session } from './session/types/session.type';
import { ResponseDeviceDto } from './dto/response-device.dto';
import { plainToInstance } from 'class-transformer';

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
    private readonly googleOauth: GoogleOauth,
    private readonly sessionProvider: SessionProvider,
  ) {}

  async genAccessToken(payload: object): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES'),
    });
  }

  async genRefreshToken(payload: object): Promise<[string, number]> {
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES'),
    });
    const token = await this.jwtService.verifyAsync(refreshToken);
    return [refreshToken, token.exp - token.iat];
  }

  async proccessLogin(
    userId: string,
    userAgent: string,
    ip: string,
  ): Promise<[string, string]> {
    const access_token = await this.genAccessToken({ id: userId });
    const [refreshToken, expiresAt] = await this.genRefreshToken({
      id: userId,
    });

    await this.createDeviceSession(
      refreshToken,
      userId,
      userAgent,
      ip,
      expiresAt,
    );
    return [access_token, refreshToken];
  }

  async createDeviceSession(
    token: string,
    userId: string,
    userAgent: string,
    ip: string,
    expiresAt: number,
  ): Promise<Session> {
    const deviceId = [ip, userAgent].join('-');
    const session: Session = {
      userId,
      active: true,
      deviceId,
      ip,
    };
    // hash hSet users:token:id {userId, active, deviceId, ip}
    await this.sessionProvider.createDeviceSession(token, session, expiresAt);
    delete session.active;
    const device = session;
    // set sAdd devices:user:id {userId, deviceId, ip}
    await this.sessionProvider.addUserDevice(userId, device);
    return session;
  }

  async updateDeviceLastSeen(userId: string, deviceId: string) {
    return await this.sessionProvider.updateDeviceLastSeen(userId, deviceId);
  }

  async getUserDevicesLastSeen(
    userId: string,
    devicesId: string[],
  ): Promise<{ deviceId: string; lastSeen: string }[]> {
    return await this.sessionProvider.getUserDevicesLastSeen(userId, devicesId);
  }

  async getAllUserDevices(
    userId: string,
    ip: string,
    userAgent: string,
  ): Promise<ResponseDeviceDto[]> {
    const devices = await this.sessionProvider.getAllUserDevices(userId);
    const devicesId = devices.map((device) => device.deviceId);
    console.log('🚀 ~ AuthService ~ devicesId:', devicesId);
    const devicesLastSeen = await this.getUserDevicesLastSeen(
      userId,
      devicesId,
    );
    const requestDeviceId = [userAgent, ip].join('-');
    console.log('🚀 ~ AuthService ~ requestDeviceId:', requestDeviceId);
    const devicesWithCurrentDevice = await Promise.all(
      devices.map(async (device) => {
        if (requestDeviceId === device.deviceId) {
          console.log(
            ' if (requestDeviceId === device.deviceId)',
            requestDeviceId,
            device.deviceId,
          );

          device.current = true;
        }
        for await (const obj of devicesLastSeen) {
          if (obj.deviceId === device.deviceId) {
            device.lastSeen = obj.lastSeen;
          }
        }
        return device;
      }),
    );
    return plainToInstance(ResponseDeviceDto, devicesWithCurrentDevice);
  }

  async deviceLogout(currentDeviceToken: string, tokens?: string[]) {
    return await this.sessionProvider.deviceLogout(currentDeviceToken, tokens);
  }

  async refresh(id: string) {
    const payloadAccess = { id };
    return await this.genAccessToken(payloadAccess);
  }

  async forgotPassword(email: EmailDto) {
    const user = await this.usersService.findUserByCriteria(email);
    if (!user) {
      throw new NotFoundException('user with this email was not found');
    }
    const payload = { email: user.email };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('FORGOT_PASSWORD_TOKEN_EXPIRES'),
    });

    const template = getForgotPasswordTemplate(
      user.username,
      token,
      email.email,
    );
    const subject = 'Yogram password restore';
    const restorePasswordDto: RestorePasswordEmailDto = {
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

  async google(code: string, userAgent: string, ip: string) {
    console.log('🚀 ~ AuthService ~ google ~ code:', code);
    const user = await this.googleOauth.performOAuth(code);
    return await this.externalLogin(user, userAgent, ip);
  }

  async externalLogin(user: LoggedUserDto, userAgent: string, ip: string) {
    const payloadAccess = { id: user.id };
    const payloadRefresh = { id: user.id };
    const accessToken = await this.genAccessToken(payloadAccess);
    const [refreshToken, expiresAt] =
      await this.genRefreshToken(payloadRefresh);

    await this.createDeviceSession(
      refreshToken,
      user.id,
      userAgent,
      ip,
      expiresAt,
    );

    await this.updateDeviceLastSeen(user.id, [ip, userAgent].join('-'));

    return { accessToken, refreshToken, user };
  }

  async authMe(id: string): Promise<ResponseUserDto> {
    return await this.usersService.findUserByCriteria({ id });
  }
}

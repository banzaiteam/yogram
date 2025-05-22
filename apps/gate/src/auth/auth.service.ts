import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoggedUserDto } from 'apps/libs/Users/dto/user/logged-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
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
}

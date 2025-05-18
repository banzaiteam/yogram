import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ResponseLoginDto } from 'apps/libs/Users/dto/user/response-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(user: ResponseLoginDto): Promise<string[]> {
    const access_token = await this.jwtService.signAsync(user, {
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES'),
    });
    console.log('🚀 ~ AuthService ~ login ~ access_token:', access_token);
    const refresh_token = await this.jwtService.signAsync(user, {
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES'),
    });
    console.log('🚀 ~ AuthService ~ login ~ refresh_token:', refresh_token);
    return [access_token, refresh_token];
  }
}

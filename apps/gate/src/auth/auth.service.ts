import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(id: string): Promise<string[]> {
    const payload = { id };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES'),
    });
    console.log('🚀 ~ AuthService ~ login ~ access_token:', access_token);
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES'),
    });
    console.log('🚀 ~ AuthService ~ login ~ refresh_token:', refresh_token);
    return [access_token, refresh_token];
  }
}

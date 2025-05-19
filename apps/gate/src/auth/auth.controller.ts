import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './decorators/user.decorator';
import { ResponseLoginDto } from '../../../../apps/libs/Users/dto/user/response-login.dto';
import { Response } from 'express';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { LoginDto } from 'apps/libs/Users/dto/user/login.dto';
import { LoginGuard } from './guards/login.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @UseGuards(LoginGuard)
  @ApiOkResponse({
    headers: {
      'Set-Cookie': {
        description: 'access_token/refresh_token',
        schema: { type: 'string' },
      },
    },
  })
  @Post('login')
  async login(
    @User() user: ResponseLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseLoginDto> {
    const [access_token, refresh_token] = await this.authService.login(user);
    res.status(200);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 60 * 1000,
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 120 * 1000,
    });
    return user;
  }
}

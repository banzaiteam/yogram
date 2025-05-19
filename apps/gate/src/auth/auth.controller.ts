import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './decorators/user.decorator';
import { ResponseLoginDto } from '../../../../apps/libs/Users/dto/user/response-login.dto';
import { Response } from 'express';
import { ApiBody, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from '../../../../apps/libs/Users/dto/user/login.dto';
import { LoginGuard } from './guards/login.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @UseGuards(LoginGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    headers: {
      'Set-Cookie': {
        description: 'access_token/refresh_token',
        schema: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'invalid login/password of not verified',
  })
  @Post('login')
  async login(
    @User() user: ResponseLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseLoginDto> {
    const [access_token, refresh_token] = await this.authService.login(user);
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

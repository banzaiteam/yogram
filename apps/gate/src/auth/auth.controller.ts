import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginGuard } from '../../../../apps/gate/common/guards/login.guard';
import { User } from './decorators/user.decorator';
import { ResponseLoginDto } from '../../../../apps/libs/Users/dto/user/response-login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LoginGuard)
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

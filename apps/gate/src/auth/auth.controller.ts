import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './decorators/user.decorator';
import { Response } from 'express';
import {
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { LoginDto } from '../../../../apps/libs/Users/dto/user/login.dto';
import { LoginGuard } from './guards/login.guard';
import { Public } from '../../../../apps/gate/common/decorators/public.decorator';
import { LoggedUserDto } from '../../../../apps/libs/Users/dto/user/logged-user.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
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
    @User() user: LoggedUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const [access_token, refresh_token] = await this.authService.login(user);
    res.cookie('access_token', access_token, {
      httpOnly: false,
      sameSite: 'strict',
      secure: true,
      maxAge: parseInt(this.configService.get('ACCESS_TOKEN_EXPIRES')),
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: parseInt(this.configService.get('REFRESH_TOKEN_EXPIRES')),
    });
    return user;
  }

  @ApiHeader({
    name: 'Authorization',
    description: ' Authorization with bearer token',
  })
  @ApiOperation({
    summary: 'Refresh access token',
  })
  @ApiOkResponse({
    headers: {
      'Set-Cookie': {
        description: 'access_token',
        schema: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'not Unauthorized',
  })
  @Get('refresh')
  async refresh(
    @User('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const access_token = await this.authService.refresh(id);
    res.cookie('access_token', access_token, {
      httpOnly: false,
      sameSite: 'strict',
      secure: true,
      maxAge: parseInt(this.configService.get('ACCESS_TOKEN_EXPIRES')),
    });
  }
}

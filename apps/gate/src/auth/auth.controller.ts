import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './decorators/user.decorator';
import { Request, Response } from 'express';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { LoginGuard } from './guards/login.guard';
import { Public } from '../../../../apps/gate/common/decorators/public.decorator';
import { LoggedUserDto } from '../../../../apps/libs/Users/dto/user/logged-user.dto';
import { ConfigService } from '@nestjs/config';
import { EmailDto } from '../../../../apps/libs/Users/dto/user/email.dto';
import { RestorePasswordDto } from '../../../../apps/libs/Users/dto/user/restore-password.dto';
import { HashPasswordPipe } from '../../../../apps/libs/common/encryption/hash-password.pipe';
import { TokenExpiredError } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { AuthMeSwagger } from './decorators/swagger/auth-me-swagger.decorator';
import { GoogleSwagger } from './decorators/swagger/google-swagger.decorator';
import { RestorePasswordSwagger } from './decorators/swagger/restore-password-swagger.decorator';
import { ForgotPasswordSwagger } from './decorators/swagger/forgot-password-swagger.decorator';
import { RefreshSwagger } from './decorators/swagger/refresh-swagger.decorator';
import { LoginSwagger } from './decorators/swagger/login-swagger.decorator';
import { RefreshGuard } from './guards/refresh.guard';
import { SkipAuthDecorator } from './decorators/skip-auth-guard.decorator';
import { ResponseDeviceDto } from './dto/response-device.dto';
import { DevicesSwagger } from './decorators/swagger/devices-swagger.decorator';
import { LogoutAllDto } from './dto/logout-all.dto';
import { LogoutSwagger } from './decorators/swagger/loggout-swagger.decorator';
import { RecaptchaGuard } from '../../../../apps/gate/common/guards/recapcha.guard';
import open from 'open';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @UseGuards(LoginGuard)
  @LoginSwagger()
  @Post('login')
  async login(
    @User() user: LoggedUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const userAgent = req.headers['user-agent'];
    const [accessToken, refresh_token] = await this.authService.proccessLogin(
      user.id,
      userAgent,
      req.ip,
    );
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: parseInt(this.configService.get('REFRESH_TOKEN_EXPIRES')),
    });
    return { accessToken };
  }

  @SkipAuthDecorator()
  @UseGuards(RefreshGuard)
  @RefreshSwagger()
  @Get('refresh')
  async refresh(@User('id') id: string) {
    const accessToken = await this.authService.refresh(id);
    return { accessToken };
  }

  @DevicesSwagger()
  @SkipAuthDecorator()
  @UseGuards(RefreshGuard)
  @Get('devices')
  async getAllUserDevices(
    @User('id') id: string,
    @Req() req: Request,
  ): Promise<ResponseDeviceDto[]> {
    const allUsersDevices = await this.authService.getAllUserDevices(
      id,
      req.headers['user-agent'],
      req.ip,
    );
    return allUsersDevices;
  }

  // pass refresh token which is the current session device
  @LogoutSwagger()
  @SkipAuthDecorator()
  @UseGuards(RefreshGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Body() logoutAllDto?: LogoutAllDto) {
    const currentDeviceToken = req.headers.authorization.split(' ')[1].trim();
    return await this.authService.deviceLogout(
      currentDeviceToken,
      logoutAllDto.tokens,
    );
  }

  // send forgotPassword email to user email
  @Public()
  @ForgotPasswordSwagger()
  @UseGuards(RecaptchaGuard)
  @Post('forgot-password')
  async forgotPassword(@Body() email: EmailDto): Promise<void> {
    await this.authService.forgotPassword(email);
  }

  // forgot password email redirect it to this endpoint to check token and redirect user to the page where he can enter new password
  @Public()
  @ApiExcludeEndpoint()
  @Get('restore-page/:token')
  async restorePage(@Param('token') token: string, @Res() res: Response) {
    try {
      const email = await this.authService.restorePage(token);
      res.redirect(
        303,
        [this.configService.get('RESTORE_PASSWORD_PAGE'), email.email].join(
          '/',
        ),
      ); // restore-password page
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        // if invalid/expired token we redirect to the sendForgotPassword email page
        res.redirect(
          303,
          this.configService.get('SEND_RESTORE_PASSWORD_EMAIL_PAGE'),
        );
        throw new BadRequestException(
          'Restore password link is expired, redirect to resend restore password page',
        );
      }
    }
  }

  // save new password and redirect to the login page
  @Public()
  @RestorePasswordSwagger()
  @UsePipes(HashPasswordPipe)
  @Patch('restore-password')
  async restorePassword(
    @Body() restorePasswordDto: RestorePasswordDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.restorePassword(restorePasswordDto);
    res.redirect(303, this.configService.get('LOGIN_PAGE'));
  }

  @Public()
  @GoogleSwagger()
  @Get('google')
  async googleOauth(@Res() res: Response) {
    try {
      const result = await open(
        'https://accounts.google.com/o/oauth2/v2/auth?client_id=704585299775-o91opnriljtokoelmpm0ahr4087cn9jr.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/v1/auth/google/callback&scope=openid%20profile%20email&response_type=code',
      );
      console.log('google after', result);
      res.status(200).json('success');
    } catch (error) {
      console.log('🚀 ~ AuthController ~ googleOauth ~ error:', error);
    }
  }

  @Public()
  @ApiExcludeEndpoint()
  @Get('google/callback')
  async googleAuthRedirect(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<{ accessToken: string; user: LoggedUserDto }> {
    const { accessToken, refreshToken, user } = await this.authService.google(
      code,
      req.headers['user-agent'],
      req.ip,
    );
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: parseInt(this.configService.get('REFRESH_TOKEN_EXPIRES')),
    });
    return { accessToken, user: plainToInstance(LoggedUserDto, user) };
  }

  @AuthMeSwagger()
  @Get('/me')
  async getUser(@User('id') id: string): Promise<LoggedUserDto> {
    return await this.authService.authMe(id);
  }
}

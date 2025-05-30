import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './decorators/user.decorator';
import { Response } from 'express';
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
import { RecaptchaGuard } from 'apps/gate/common/guards/recapcha.guard';
import { AuthMeSwagger } from './decorators/swagger/auth-me-swagger.decorator';
import { GoogleSwagger } from './decorators/swagger/google-swagger.decorator';
import { RestorePasswordSwagger } from './decorators/swagger/restore-password-swagger.decorator';
import { ForgotPasswordSwagger } from './decorators/swagger/forgot-password-swagger.decorator';
import { RefreshSwagger } from './decorators/swagger/refresh-swagger.decorator';
import { LoginSwagger } from './decorators/swagger/login-swagger.decorator';

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
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoggedUserDto> {
    const access_token = await this.authService.genAccessToken({ id: user.id });
    const refresh_token = await this.authService.genRefreshToken({
      id: user.id,
    });
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

  @RefreshSwagger()
  @Get('refresh')
  async refresh(
    @User('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('🚀 ~ AuthController ~ id:', id);
    const access_token = await this.authService.refresh(id);
    res.status(200);
    res.cookie('access_token', access_token, {
      httpOnly: false,
      sameSite: 'strict',
      secure: true,
      maxAge: parseInt(this.configService.get('ACCESS_TOKEN_EXPIRES')),
    });
  }

  // send forgotPassword email to user email
  @Public()
  @ForgotPasswordSwagger()
  // @UseGuards(RecaptchaGuard)
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
        throw new UnauthorizedException();
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
    res.redirect(303, this.configService.get('GOOGLE_OAUTH_URI'));
  }

  @Public()
  @ApiExcludeEndpoint()
  @Get('google/callback')
  async googleAuthRedirect(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoggedUserDto> {
    const [access_token, refresh_token, user] =
      await this.authService.google(code);
    console.log('🚀 ~ AuthController ~ user:', user);
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
    return plainToInstance(LoggedUserDto, user);
  }

  @AuthMeSwagger()
  @Get('/me')
  async getUser(@User('id') id: string): Promise<LoggedUserDto> {
    return await this.authService.authMe(id);
  }
}

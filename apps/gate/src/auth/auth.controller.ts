import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import {
  ApiBody,
  ApiExcludeEndpoint,
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
import { EmailDto } from '../../../../apps/libs/Users/dto/user/email.dto';
import { RestorePasswordDto } from '../../../../apps/libs/Users/dto/user/restore-password.dto';
import { HashPasswordPipe } from '../../../../apps/libs/common/encryption/hash-password.pipe';
import { TokenExpiredError } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { RecaptchaGuard } from 'apps/gate/common/guards/recapcha.guard';

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
        description: 'access_token without httpOnly/refresh_token httpOnly',
        schema: { type: 'string' },
      },
    },
    type: LoggedUserDto,
  })
  @ApiResponse({
    status: 401,
    description: 'invalid login/password or not verified',
  })
  @ApiResponse({
    status: 404,
    description: 'user does not exist',
  })
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
  @ApiResponse({
    status: 200,
    description: 'email was sent succesfully',
  })
  @ApiResponse({
    status: 401,
    description: 'user with this email was not found',
  })
  @ApiResponse({
    status: 400,
    description: 'user was not verified',
  })
  @ApiResponse({
    status: 500,
    description: 'forgot password email was not sent',
  })
  @ApiOperation({
    summary: 'Send forgotPassword email to the user email',
    description: 'call when user entered email on forgotPassword page',
  })
  // @UseGuards(RecaptchaGuard)
  @HttpCode(HttpStatus.OK)
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

  @Public()
  // save new password and redirect to the login page
  @ApiHeader({
    name: 'Authorization',
    description: ' Authorization with bearer token',
  })
  @ApiOperation({
    summary: 'save new password and redirect to the login page',
    description: 'call when user entered new password',
  })
  @ApiResponse({
    status: 200,
    description: 'user`s password was updated successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'user password was not updated',
  })
  @ApiResponse({
    status: 404,
    description: 'user was not found',
  })
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    headers: {
      'Set-Cookie': {
        description: 'access_token without httpOnly/refresh_token httpOnly',
        schema: { type: 'string' },
      },
    },
    type: LoggedUserDto,
  })
  @ApiResponse({
    status: 500,
    description: 'user was not created/logged in',
  })
  @ApiOperation({
    summary: 'Signup/login with google',
    description:
      'if user didnt register with form, usual user account will be created and logged in. If user have account he will be logged in',
  })
  @Public()
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
}

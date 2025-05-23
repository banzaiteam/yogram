import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common';
import { SignupService } from './signup.service';
import { CreateUserDto } from '../../../../apps/libs/Users/dto/user/create-user.dto';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { HashPasswordPipe } from '../../../../apps/libs/common/encryption/hash-password.pipe';
import { Public } from '../../../../apps/gate/common/decorators/public.decorator';
import { TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@ApiTags('SignUp')
@Controller('signup')
export class SignupController {
  constructor(
    private readonly signupService: SignupService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @ApiResponse({ status: 201, description: 'user was created' })
  @ApiResponse({
    status: 409,
    description: 'user with this email/username already exists',
  })
  @ApiOperation({
    summary: 'New user registration',
  })
  @UsePipes(HashPasswordPipe)
  @Post()
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.signupService.create(createUserDto);
    res.status(201);
  }

  @Public()
  @ApiExcludeEndpoint()
  @Get('email-verify/:token')
  async emailVerify(@Param('token') token: string, @Res() res: Response) {
    try {
      await this.signupService.emailVerify(token);
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        res.redirect(this.configService.get('resend_verify_email_page'));
      }
    }
  }
}

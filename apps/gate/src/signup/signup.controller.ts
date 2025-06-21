import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import { SignupService } from './signup.service';
import { CreateUserDto } from '../../../../apps/libs/Users/dto/user/create-user.dto';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { HashPasswordPipe } from '../../../../apps/libs/common/encryption/hash-password.pipe';
import { Public } from '../../../../apps/gate/common/decorators/public.decorator';
import { TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailDto } from '../../../../apps/libs/Users/dto/user/email.dto';
import { SendVerifyEmailSwagger } from './decorators/swagger/send-verify-email-swagger.decorator';
import { SignUpSwagger } from './decorators/swagger/signup-swagger.decorator';
import axios from 'axios';

@ApiTags('SignUp')
@Controller('signup')
export class SignupController {
  constructor(
    private readonly signupService: SignupService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @SignUpSwagger()
  @UsePipes(HashPasswordPipe)
  @Post()
  async signUp(
    // @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<void> {
    try {
      // todo! error 413, bodyparser limit 150 mb does not help when use gateService
      const microserviceResponse = await axios.post(
        'http://localhost:3001/api/v1/users/create',
        req,
        {
          headers: { ...req.headers },
          responseType: 'stream',
        },
      );

      res.setHeader('content-type', 'application/json');
      microserviceResponse.data.pipe(res);
    } catch (err) {
      // responseType: 'stream' error handle
      await new Promise((res) => {
        let streamString = '';
        err.response.data.setEncoding('utf8');
        err.response.data
          .on('data', (utf8Chunk) => {
            streamString += utf8Chunk;
          })
          .on('end', async () => {
            err.response.stream = streamString;
          });
        setTimeout(() => {
          res(err);
        }, 300);
      }).then((data) => {
        throw new HttpException(data, data['status']);
      });
    }
    // await this.signupService.create(createUserDto);
    res.status(201);
  }

  @Public()
  @ApiExcludeEndpoint()
  @Get('email-verify/:token')
  async emailVerify(@Param('token') token: string, @Res() res: Response) {
    try {
      await this.signupService.emailVerify(token);
      res.redirect(303, this.configService.get('LOGIN_PAGE'));
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        // redirect to 'send-verify-email' where unauthorized user should enter email to resend verification email
        res.redirect(303, this.configService.get('RESEND_EMAIL_VERIFY_PAGE'));
      }
    }
  }

  // if verify email link expired should be redirected here
  @Public()
  @SendVerifyEmailSwagger()
  @Post('send-verify-email')
  async SendVerifyEmail(@Body() email: EmailDto) {
    await this.signupService.sendVerifyEmail(email);
  }
}

import {
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { SignupService } from './signup.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public } from '../../../../apps/gate/common/decorators/public.decorator';
import { TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SendVerifyEmailSwagger } from './decorators/swagger/send-verify-email-swagger.decorator';
import { SignUpSwagger } from './decorators/swagger/signup-swagger.decorator';
import axios from 'axios';
import { v4 } from 'uuid';
import { HttpUsersPath } from '../../../../apps/libs/Users/constants/path.enum';
import { SseAvatarSwagger } from './decorators/swagger/sse-avatar-swagger.decorator';

@ApiTags('SignUp')
@Controller('signup')
export class SignupController {
  constructor(
    private readonly signupService: SignupService,
    private readonly configService: ConfigService,
  ) {}

  @SseAvatarSwagger()
  @Public()
  @Get('sse-avatar')
  async avatarUploaded(@Req() req: Request, @Res() res: Response) {
    try {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      res.flushHeaders();

      const microserviceResponse = await axios.get(
        [this.configService.get('USERS_SERVICE_URL'), 'users/sse-avatar'].join(
          '/',
        ),
        {
          headers: { ...req.headers },
          responseType: 'stream',
        },
      );
      microserviceResponse.data.pipe(res);

      req.on('close', () => {
        res.end();
      });
    } catch (error) {
      console.log('🚀 ~ SignupController ~ users/sse-avatar ~ error:', error);
      res.write(`data: ${error}\n\n`);
    }
  }

  @Public()
  @SignUpSwagger()
  @Post()
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<void> {
    try {
      // todo! error 413, bodyparser limit 150 mb does not help when use gateService
      const microserviceResponse = await axios.post(
        [
          this.configService.get('USERS_SERVICE_URL'),
          HttpUsersPath.Create,
        ].join('/'),
        req,
        {
          headers: { ...req.headers, id: v4() },
          responseType: 'stream',
        },
      );

      res.setHeader('content-type', 'application/json');
      microserviceResponse.data.pipe(res);
      res.status(201);
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
  }

  @Public()
  @ApiExcludeEndpoint()
  @Get('email-verify/:token/:email')
  async emailVerify(
    @Param('token') token: string,
    @Param('email') email: string,
    @Res() res: Response,
  ) {
    try {
      await this.signupService.emailVerify(token);
      res.redirect(303, this.configService.get('LOGIN_PAGE'));
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        // redirect to 'send-verify-email' where unauthorized user should enter email to resend verification email
        res.redirect(
          303,
          [this.configService.get('RESEND_EMAIL_VERIFY_PAGE'), email].join('/'),
        );
      }
    }
  }

  // if verify email link expired should be redirected here
  @Public()
  @SendVerifyEmailSwagger()
  @Get('send-verify-email/:email')
  async SendVerifyEmail(@Param('email') email: string) {
    await this.signupService.sendVerifyEmail({ email });
  }
}

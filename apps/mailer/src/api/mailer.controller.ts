import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { UserVerifyEmailDto } from 'apps/libs/Users/dto/user/user-verify-email.dto';
import { CommandBus } from '@nestjs/cqrs';
import { SendUserVerifyEmailCommand } from '../features/verifyEmail/command/send-user-verify-email.command';
import { Response } from 'express';

@Controller('mail')
export class MailerController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async sendUserVerifyEmail(
    @Body() userVerifyEmailDto: UserVerifyEmailDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.commandBus.execute(
      new SendUserVerifyEmailCommand(userVerifyEmailDto),
    );
    res.status(200);
  }
}

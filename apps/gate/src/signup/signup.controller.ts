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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { HashPasswordPipe } from '../../../../apps/libs/common/encryption/hash-password.pipe';

@ApiTags('SignUp')
@Controller('signup')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @ApiResponse({ status: 201, description: 'user was created' })
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

  @Get('email-verify/:token')
  async emailVerify(@Param('token') token: string): Promise<void> {
    await this.signupService.emailVerify(token);
  }
}

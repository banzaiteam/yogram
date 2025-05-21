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
import { Public } from 'apps/gate/common/decorators/public.decorator';

@ApiTags('SignUp')
@Controller('signup')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

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
  async emailVerify(@Param('token') token: string): Promise<void> {
    await this.signupService.emailVerify(token);
  }
}

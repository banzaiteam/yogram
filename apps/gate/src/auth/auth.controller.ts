import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';
import { LoginGuard } from './common/guards/login.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LoginGuard)
  @Post('login')
  async login(): Promise<void> {}
}

import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginGuard } from 'apps/gate/common/guards/login.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LoginGuard)
  @Post('login')
  async login(): Promise<void> {
    // return await this.usersGateService.usersHttpServiceGet(
    //   `users?email=retouch226@gmail.com`,
    //   {},
    // );
  }
}

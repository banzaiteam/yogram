import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';
import { LoginGuard } from 'apps/gate/common/guards/login.guard';
import { GateService } from 'apps/libs/gateService';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    // private readonly usersGateService: GateService,
  ) {}

  @UseGuards(LoginGuard)
  @Post('login')
  async login(): Promise<void> {
    // return await this.usersGateService.usersHttpServiceGet(
    //   `users?email=retouch226@gmail.com`,
    //   {},
    // );
  }
}

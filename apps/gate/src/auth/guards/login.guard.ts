import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { GateService } from '../../../../../apps/libs/gateService';
import { LoginDto } from '../../../../../apps/libs/Users/dto/user/login.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth.service';

export class LoginGuard implements CanActivate {
  constructor(
    @Inject('GateService') private readonly usersGateService: GateService,
    private readonly authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    // console.log('🚀 ~ LoginGuard ~ canActivate ~ request:', request);
    const loginDto: LoginDto = request.body;
    const user = await this.usersGateService.usersHttpServiceGet(
      `users/login/${loginDto.email}`,
      {},
    );
    if (user && user.password) {
      if (await bcrypt.compare(loginDto.password, user.password)) {
        delete user.password;
        const userAgent = request.headers['user-agent'];
        const ip = request.ip;
        const requestDeviceId = [ip, userAgent].join('-');
        await this.authService.updateDeviceLastSeen(user.id, requestDeviceId);
        request.user = user;
        return true;
      }

      throw new UnauthorizedException('invalid login/password');
    } else {
      throw new UnauthorizedException(
        'you created account using oAuth2, please create new password using forgotPassword',
      );
    }
  }
}

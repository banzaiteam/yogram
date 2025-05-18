import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { GateService } from 'apps/libs/gateService';
import { LoginDto } from 'apps/libs/Users/dto/user/login.dto';

export class LoginGuard implements CanActivate {
  constructor(
    @Inject('GateService') private readonly usersGateService: GateService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const loginDto: LoginDto = request.body;
    console.log('here...');

    const user = await this.usersGateService.usersHttpServiceGet(
      `users?id=${loginDto.email}`,
      {},
    );
    console.log('🚀 ~ LoginGuard ~ user:', user);
    return true;
  }
}

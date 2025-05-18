import { CanActivate, ExecutionContext } from '@nestjs/common';
import { GateService } from 'apps/libs/gateService';
import { Observable } from 'rxjs';

export class LoginGuard implements CanActivate {
  constructor(private readonly usersGateService: GateService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const loginDto = request.body;

    return true;
  }
}

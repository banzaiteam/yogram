import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Is_Public } from '../decorators/public.decorator';
import { SKIP_AUTH_GUARD } from '../../../../apps/gate/src/auth/decorators/skip-auth-guard.decorator';
import { AuthService } from '../../../../apps/gate/src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(Is_Public, [
      context.getClass(),
      context.getHandler(),
    ]);
    const skipAuth = this.reflector.getAllAndOverride(SKIP_AUTH_GUARD, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (isPublic || skipAuth) return true;
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies?.refreshToken;
    if (!refreshToken) throw new UnauthorizedException('No refreshToken');
    try {
      let payload = await this.jwtService.verifyAsync(refreshToken);
      delete payload.iat;
      delete payload.exp;
      const userAgent = request.headers['user-agent'];
      const ip = request.ip;
      const requestDeviceId = [ip, userAgent].join('-');
      await this.authService.updateDeviceLastSeen(payload.id, requestDeviceId);
      request.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

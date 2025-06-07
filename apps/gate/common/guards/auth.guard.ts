import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Is_Public } from '../decorators/public.decorator';
import { SKIP_AUTH_GUARD } from 'apps/gate/src/auth/decorators/skip-auth-guard.decorator';
import { AuthService } from 'apps/gate/src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext) {
    console.log('AuthGuard');

    const isPublic = this.reflector.getAllAndOverride(Is_Public, [
      context.getClass(),
      context.getHandler(),
    ]);
    const skipAuth = this.reflector.getAllAndOverride(SKIP_AUTH_GUARD, [
      context.getClass(),
      context.getHandler(),
    ]);
    console.log('🚀 ~ AuthGuard ~ canActivate ~ skipAuth:', skipAuth);
    if (isPublic || skipAuth) return true;
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    if (!token) throw new UnauthorizedException('No Bearer token');
    try {
      const accessToken = token.split(' ')[1];
      let payload = await this.jwtService.verifyAsync(accessToken.trim());
      delete payload.iat;
      delete payload.exp;
      const userAgent = request.headers['user-agent'];
      const ip = request.ip;
      const requestDeviceId = [userAgent, ip].join('-');
      await this.authService.updateDeviceLastSeen(payload.id, requestDeviceId);
      request.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

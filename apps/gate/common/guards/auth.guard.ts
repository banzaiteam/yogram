import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Is_Public } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(Is_Public, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    if (!token) throw new UnauthorizedException();
    try {
      const accessToken = token.split(' ')[1];
      request.user = await this.jwtService.verifyAsync(accessToken.trim());
      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}

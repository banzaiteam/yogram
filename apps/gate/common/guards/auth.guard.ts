import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    if (!token) throw new UnauthorizedException();
    try {
      const accessToken = token.split(' ')[1];
      console.log('🚀 ~ AuthGuard ~ canActivate ~ accessToken:', accessToken);
      request.user = await this.jwtService.verifyAsync(accessToken.trim());
      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}

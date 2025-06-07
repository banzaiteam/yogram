import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { SessionProvider } from '../session/session.provider';
import { Device } from '../session/types/device.type';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionProvider: SessionProvider,
    private readonly usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext) {
    console.log('RefreshGuard');
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    if (!token) throw new UnauthorizedException('No Bearer token');
    const refreshToken = token.split(' ')[1].trim();
    let payload;
    try {
      // if token is dead we delete session and throw unauthorized
      payload = await this.sessionProvider.verifyToken(refreshToken);
      console.log('🚀 ~ RefreshGuard ~ canActivate ~ payload:', payload);
    } catch (err) {
      console.log('🚀 ~ RefreshGuard ~ canActivate ~ err:', err);
      if (err instanceof TokenExpiredError) {
        await this.sessionProvider.deleteSession(refreshToken);
        throw new UnauthorizedException('RefreshGuard: expired/invalid token');
      }
    }
    const user = await this.usersService.findUserByCriteria({
      id: payload['id'],
    });
    if (!user)
      throw new UnauthorizedException('RefreshGuard: user was not found');
    //if !session or !active -> session does not exists or unactive, maybe fraud after user logged out and try to enter with stolen, still live token
    const deviceSession =
      await this.sessionProvider.findSessionbyToken(refreshToken);
    console.log(
      '🚀 ~ RefreshGuard ~ canActivate ~ deviceSession:',
      deviceSession,
    );
    if (!deviceSession || !deviceSession['active']) {
      throw new BadRequestException('session does not exists or unactive');
    }
    request.user = payload;
    return true;
  }
}

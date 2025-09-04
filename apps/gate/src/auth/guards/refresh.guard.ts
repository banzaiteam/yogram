import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { SessionProvider } from '../session/session.provider';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionProvider: SessionProvider,
    private readonly usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies?.refreshToken;
    if (!refreshToken) throw new UnauthorizedException('No refreshToken');
    let payload;
    try {
      // if token is dead we delete session and throw unauthorized
      payload = await this.sessionProvider.verifyToken(refreshToken);
    } catch (err) {
      console.log('🚀 ~ RefreshGuard ~ err:', err);
      if (err instanceof TokenExpiredError) {
        await this.sessionProvider.deleteSession(refreshToken);
        throw new UnauthorizedException('RefreshGuard: expired/invalid token');
      }
    }
    // check if user is alive
    const user = await this.usersService.findUserByCriteria({
      id: payload['id'],
    });
    if (!user)
      throw new UnauthorizedException('RefreshGuard: user was not found');
    // if !session or !active -> session does not exists or unactive, maybe some fraud try to enter with stolen, still alive token after the user logged out
    // we did not delete it after logout to check  if it active when someone try to auth with refresh
    const deviceSession =
      await this.sessionProvider.findSessionByToken(refreshToken);
    if (
      !Object.keys(deviceSession).length ||
      deviceSession['active'] === 'false'
    ) {
      throw new UnauthorizedException('session does not exists or unactive');
    }
    request.user = payload;
    return true;
  }
}

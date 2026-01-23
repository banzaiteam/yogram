import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

export class WsAuthAdapter extends IoAdapter {
  private readonly logger = new Logger(WsAuthAdapter.name);

  constructor(
    private jwtService: JwtService,
    private readonly app: INestApplicationContext,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: any): Server {
    const server = super.createIOServer(port, options);
    server.use(async (socket: Socket, next) => {
      const token = socket.handshake.auth.token;
      console.log('🚀 ~ WsAuthAdapter ~ createIOServer ~ token:', token);
      if (!token) {
        this.logger.error('No authorization token provided');
        return next(new Error('Authentication error'));
      }
      try {
        const user = await this.jwtService.verifyAsync(token);

        if (!user) {
          return next(new Error('Authentication error'));
        }

        (socket as any).user = user;
        next();
      } catch (error) {
        this.logger.error('Token validation failed', error.stack);
        next(new Error('Authentication error'));
      }
    });
    return server;
  }
}

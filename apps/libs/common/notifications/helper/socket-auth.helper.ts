import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void;

export const socketAuthMiddleware = (
  jwtService: JwtService,
): SocketMiddleware => {
  return async (socket: Socket, next) => {
    try {
      const token = socket.handshake.headers?.authorization;
      if (!token) next(new WsException('Socket Unauthorized Exception'));
      const payload = jwtService.verify(token.trim());
      if (!payload) next(new WsException('Socket Unauthorized Exception'));
      socket.data.user = payload['id'];
      next();
    } catch (err) {
      console.log('🚀 ~ socketAuthMiddleware ~ err:', err);
      next(new WsException(err));
    }
  };
};

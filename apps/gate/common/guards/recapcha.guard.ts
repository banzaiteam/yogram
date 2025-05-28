import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { verifyRecaptcha } from '../utils/verify-recapcha';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RecaptchaGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-recaptcha-token'];
    if (!token) {
      throw new BadRequestException('Recaptcha token is required');
    }

    return await verifyRecaptcha(token, this.httpService, this.configService);
  }
}

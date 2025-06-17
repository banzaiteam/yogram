import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

export const verifyRecaptcha = async (
  token: string,
  httpService: HttpService,
  configService: ConfigService,
) => {
  const secretKey = configService.get('RECAPTCHA_SECRET_KEY');
  const verifyUrl = configService.get('RECAPTCHA_URL');

  try {
    const response = await lastValueFrom(
      httpService.post(verifyUrl, null, {
        params: {
          secret: secretKey,
          response: token,
        },
      }),
    );
    const { success } = response.data;
    if (!success) throw new BadRequestException('Invalid captcha');
    return true;
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return false;
  }
};

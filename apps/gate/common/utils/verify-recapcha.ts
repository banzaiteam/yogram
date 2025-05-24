import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

export const verifyRecaptcha = async (
  token: string,
  httpService: HttpService,
) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const verifyUrl = process.env.RECAPCHA_URL;
  const minimumScore = 0.5;
  const expectedHostname = process.env.RECAPTCHA_HOSTNAME;

  try {
    const response = await lastValueFrom(
      httpService.post(verifyUrl, null, {
        params: {
          secret: secretKey,
          response: token,
        },
      }),
    );

    const { success, score, hostname } = response.data;
    console.log(`🚀 ~ { success, score, hostname }:`, {
      success,
      score,
      hostname,
    });

    if (!success) {
      throw new BadRequestException('Invalid captcha');
    }

    if (score < minimumScore) {
      throw new BadRequestException('Low captcha score');
    }

    if (expectedHostname && hostname !== expectedHostname) {
      throw new InternalServerErrorException('Invalid hostname');
    }

    return true;
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return false;
  }
};

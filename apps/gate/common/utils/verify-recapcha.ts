import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RecaptchaV2 } from 'recaptcha-node';

export const verifyRecaptcha = async (
  token: string,
  configService: ConfigService,
) => {
  console.log('🚀 ~ token:', token);
  const secretKey = configService.get('RECAPTCHA_SECRET_KEY');
  try {
    const recaptcha = new RecaptchaV2(secretKey);
    const response = await recaptcha.verify(token);
    console.log('🚀 ~ response:', response);

    const { success } = response;
    if (success) return true;
    if (!success) throw new BadRequestException('Invalid captcha');
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    throw new BadRequestException('Invalid captcha');
  }
};

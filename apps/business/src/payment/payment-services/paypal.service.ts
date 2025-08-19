import { ConfigService } from '@nestjs/config';
import { IPaymentService } from '../interfaces/payment-service.interface';
import { SubscriptionType } from 'apps/libs/Business/constants/subscription-type.enum';
import { Payment } from '../../infrastructure/entity/payment.entity';
import { getSubscriptionPrice } from '../../helper/get-subscription-price.helper';
import paypal from 'paypal-rest-sdk';

export class PayPalService implements IPaymentService {
  constructor(private readonly configService: ConfigService) {}

  async pay(
    address: string,
    subscriptionType: SubscriptionType,
  ): Promise<Payment> {
    paypal.configure({
      mode: 'sandbox',
      client_id: this.configService.get('PAYPAL_CLIENT_ID'),
      client_secret: this.configService.get('PAYPAL_SECRET'),
    });
    const price = getSubscriptionPrice(subscriptionType);
    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
      },
      transactions: [
        {
          amount: {
            currency: 'USD',
            total: price.toString(),
          },
          description: 'Business subscribe',
        },
      ],
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            console.log('payment gone');

            // res.redirect(payment.links[i].href);
          }
        }
      }
    });
    return;
  }
}

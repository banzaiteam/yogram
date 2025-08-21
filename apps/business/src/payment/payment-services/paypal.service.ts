import { IPaymentService } from '../interfaces/payment-service.interface';
import { SubscriptionType } from '../../../../../apps/libs/Business/constants/subscription-type.enum';
import { getSubscriptionPrice } from '../../helper/get-subscription-price.helper';
import { InternalServerErrorException } from '@nestjs/common';
import { EnvironmentMode } from '../../settings/configuration';
import { HttpBusinessPath } from '../../../../../apps/libs/Business/constants/path.constant';
import { PaymentType } from '../../../../../apps/libs/Business/constants/payment-type.enum';
import { Currency } from '../../../../../apps/libs/Business/constants/currency.enum';
import { PaypalPaymentDto } from '../../../../../apps/libs/Business/dto/input/paypal-payment.dto';
import paypal from 'paypal-rest-sdk';

export class PayPalService implements IPaymentService {
  constructor(
    private readonly client_id: string,
    private readonly client_secret: string,
    private readonly businessServiceUrl: string,
  ) {
    paypal.configure({
      mode:
        process.env.NODE_ENV === EnvironmentMode.DEVELOPMENT ||
        EnvironmentMode.TESTING
          ? 'sandbox'
          : 'live',
      client_id: this.client_id,
      client_secret: this.client_secret,
    });
  }

  async pay(
    paymentType: PaymentType,
    subscriptionType: SubscriptionType,
  ): Promise<string> {
    const searchParams = {
      page_size: 10,
      page: 1,
    };
    paypal.invoice.search(searchParams, function (error, invoices) {
      if (error) {
        console.error(error.response);
      } else {
        console.log('Invoices found:');
        console.log(JSON.stringify(invoices));
      }
    });

    const price = getSubscriptionPrice(subscriptionType);
    console.log('🚀 ~ PayPalService ~ pay ~ price:', price);
    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: `${this.businessServiceUrl}/${HttpBusinessPath.PaypalSuccess}?payment=${paymentType}`,
        cancel_url: `${this.businessServiceUrl}/${HttpBusinessPath.PaypalCancel}`,
      },
      transactions: [
        {
          amount: {
            currency: Currency.Usd,
            total: price.toString(),
          },
          description: 'Business subscribe',
        },
      ],
    };

    const promise = new Promise((res, rej) => {
      paypal.payment.create(
        create_payment_json,
        async function (error, payment) {
          if (error) {
            rej(error);
          } else {
            payment.links.map(async (link) => {
              {
                if (link.rel === 'approval_url') {
                  console.log('🚀 ~ PayPalService ~ pay ~ link.rel:', link);
                  res(link.href);
                }
              }
            });
          }
        },
      );
    });
    try {
      const paypalLink = <string>await promise;
      return paypalLink;
    } catch (error) {
      console.log('🚀 ~ PayPalService ~ pay ~ error:', error);
      throw new InternalServerErrorException(error);
    }
  }

  async paymentSuccess(paypalPaymentDto: PaypalPaymentDto): Promise<string> {
    const PayerID = paypalPaymentDto.PayerID;
    const paymentId = paypalPaymentDto.paymentId;

    const execute_payment_json = {
      payer_id: PayerID,
      transactions: [],
    };

    const promise = new Promise((res, rej) => {
      paypal.payment.execute(
        paymentId,
        execute_payment_json,
        function (error, payment) {
          if (error) {
            rej(error);
            throw error;
          } else {
            res(payment.state);
          }
        },
      );
    });
    return <string>await promise;
  }
}

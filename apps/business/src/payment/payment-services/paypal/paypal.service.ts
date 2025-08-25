import { IPaymentService } from '../../interfaces/payment-service.interface';
import { SubscriptionType } from '../../../../../libs/Business/constants/subscription-type.enum';
import { getSubscriptionPrice } from '../../../helper/get-subscription-price.helper';
import { InternalServerErrorException } from '@nestjs/common';
import { EnvironmentMode } from '../../../settings/configuration';
import { HttpBusinessPath } from '../../../../../libs/Business/constants/path.constant';
import { PaymentType } from '../../../../../libs/Business/constants/payment-type.enum';
import { Currency } from '../../../../../libs/Business/constants/currency.enum';
import paypal, {
  CheckoutPaymentIntent,
  Client,
  Environment,
  LogLevel,
  OrderRequest,
  OrdersController,
} from '@paypal/paypal-server-sdk';
import { IProduct } from '../../interfaces/product.interface';
import { PaypalCapturePaymentResponse } from 'apps/libs/Business/dto/response/paypal-capture-payment-response.dto';

export class PayPalService implements IPaymentService {
  private client: Client;
  constructor(
    private readonly client_id: string,
    private readonly client_secret: string,
    private readonly businessServiceUrl: string,
  ) {
    this.client = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: client_id,
        oAuthClientSecret: client_secret,
      },
      timeout: 0,
      environment:
        process.env.NODE_ENV === EnvironmentMode.DEVELOPMENT ||
        EnvironmentMode.TESTING
          ? Environment.Sandbox
          : Environment.Production,
      logging: {
        logLevel: LogLevel.Info,
        logRequest: {
          logBody: true,
        },
        logResponse: {
          logHeaders: true,
        },
      },
    });
  }

  async capturePayment(token: string): Promise<PaypalCapturePaymentResponse> {
    const ordersController = new OrdersController(this.client);
    const response = await ordersController.captureOrder({ id: token });
    const orderResult = await ordersController.getOrder({
      id: response.result.id,
    });
    const body = JSON.parse(orderResult.body.toString());
    const subscriptions = body.purchase_units
      .map((item) =>
        item.items.map((innerItem) => {
          return JSON.parse(innerItem.description);
        }),
      )
      .flat()
      .flat();
    console.log(
      '🚀 ~ PayPalService ~ capturePayment ~ subscriptions:',
      subscriptions,
    );
    const capturePaymentResponse: PaypalCapturePaymentResponse = {
      status: response.result.status,
      subscriptions: subscriptions[0],
    };
    return capturePaymentResponse;
  }

  async pay(
    userId: string,
    paymentType: PaymentType,
    subscriptionType: SubscriptionType,
  ): Promise<string> {
    const ordersController = new OrdersController(this.client);

    const price = getSubscriptionPrice(subscriptionType);
    const product = {
      name: 'businessSubscription',
      quantity: '1',
      unitAmount: {
        currencyCode: Currency.Usd,
        value: price.toString(),
      },
      description: JSON.stringify({
        userId,
        paymentType: paymentType,
        subscriptionType: subscriptionType,
      }),
    };
    const body: OrderRequest = {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [
        {
          amount: {
            currencyCode: Currency.Usd,
            value: price.toString(),
            breakdown: {
              itemTotal: {
                currencyCode: Currency.Usd,
                value: price.toString(),
              },
            },
          },
          items: [product],
        },
      ],
      paymentSource: {
        paypal: {
          experienceContext: {
            returnUrl: `${this.businessServiceUrl}/${HttpBusinessPath.PayPalCapture}?payment=${paymentType}`,
            cancelUrl: `${this.businessServiceUrl}/${HttpBusinessPath.PayPalCancel}`,
          },
        },
      },
    };
    const order = await ordersController.createOrder({ body });

    const orderBody = JSON.parse(order.body.toString());
    const link = orderBody.links.filter((link) => {
      if (link.rel === 'payer-action') {
        console.log('link.href', link.href);

        return link.href;
      }
    });
    if (!link) {
      throw new InternalServerErrorException(
        'PayPalService error: no link to pay',
      );
    }
    return link[0].href;
  }

  // async pay(
  //   paymentType: PaymentType,
  //   subscriptionType: SubscriptionType,
  // ): Promise<string> {
  //   const price = getSubscriptionPrice(subscriptionType);

  //   const create_payment_json = {
  //     intent: 'sale',
  //     payer: {
  //       payment_method: 'paypal',
  //     },
  //     redirect_urls: {
  //       return_url: `${this.businessServiceUrl}/${HttpBusinessPath.PaypalSuccess}?payment=${paymentType}`,
  //       cancel_url: `${this.businessServiceUrl}/${HttpBusinessPath.PaypalCancel}`,
  //     },
  //     transactions: [
  //       {
  //         amount: {
  //           currency: Currency.Usd,
  //           total: price.toString(),
  //         },
  //         description: 'Business subscribe',
  //       },
  //     ],
  //   };

  //   const promise = new Promise((res, rej) => {
  //     paypal.payment.create(
  //       create_payment_json,
  //       async function (error, payment) {
  //         if (error) {
  //           rej(error);
  //         } else {
  //           payment.links.map(async (link) => {
  //             {
  //               if (link.rel === 'approval_url') {
  //                 console.log('🚀 ~ PayPalService ~ pay ~ link.rel:', link);
  //                 res(link.href);
  //               }
  //             }
  //           });
  //         }
  //       },
  //     );
  //   });
  //   try {
  //     const paypalLink = <string>await promise;
  //     return paypalLink;
  //   } catch (error) {
  //     console.log('🚀 ~ PayPalService ~ pay ~ error:', error);
  //     throw new InternalServerErrorException(error);
  //   }
  // }

  private async createProduct(product: IProduct) {}

  // async paymentSuccess(paypalPaymentDto: PaypalPaymentDto): Promise<string> {
  //   const PayerID = paypalPaymentDto.PayerID;
  //   const paymentId = paypalPaymentDto.paymentId;

  //   const execute_payment_json = {
  //     payer_id: PayerID,
  //     transactions: [],
  //   };

  //   const promise = new Promise((res, rej) => {
  //     paypal.payment.execute(
  //       paymentId,
  //       execute_payment_json,
  //       function (error, payment) {
  //         if (error) {
  //           rej(error);
  //           throw error;
  //         } else {
  //           res(payment.state);
  //         }
  //       },
  //     );
  //   });
  //   return <string>await promise;
  // }
}

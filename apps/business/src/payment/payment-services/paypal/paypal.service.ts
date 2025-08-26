import { IPaymentService } from '../../interfaces/payment-service.interface';
import { InternalServerErrorException } from '@nestjs/common';
import { EnvironmentMode } from '../../../settings/configuration';
import { HttpBusinessPath } from '../../../../../libs/Business/constants/path.constant';
import { PaymentType } from '../../../../../libs/Business/constants/payment-type.enum';
import { PaypalCapturePaymentResponse } from 'apps/libs/Business/dto/response/paypal-capture-payment-response.dto';
import { createBusinessProduct } from './helpers/create-business-product.helper';
import { Currency } from '../../../../../libs/Business/constants/currency.enum';
import { SubscriptionType } from 'apps/libs/Business/constants/subscription-type.enum';
import { IProduct } from './interfaces/product.interface';
import { getSubscriptionPrice } from 'apps/business/src/helper/get-subscription-price.helper';
import paypal, {
  CheckoutPaymentIntent,
  Client,
  Environment,
  LogLevel,
  OrderRequest,
  OrdersController,
} from '@paypal/paypal-server-sdk';
import axios from 'axios';
import { createBusinessPlan } from './helpers/create-business-plan.helper';

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

  async authentication(): Promise<string> {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    const result = await axios.post(
      'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      params,
      {
        auth: { username: this.client_id, password: this.client_secret },
        headers: {},
      },
    );
    return result.data.access_token;
  }

  async subscribeToPlan() {}

  async pay(
    userId: string,
    paymentType: PaymentType,
    subscriptionType: SubscriptionType,
  ): Promise<string> {
    const ordersController = new OrdersController(this.client);
    const price = getSubscriptionPrice(subscriptionType);
    //todo! delete
    console.log('listProducts', await this.listPlans());
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
    const capturePaymentResponse: PaypalCapturePaymentResponse = {
      status: response.result.status,
      subscriptions: subscriptions[0],
    };
    return capturePaymentResponse;
  }

  private async createProduct(
    subscriptionType: SubscriptionType,
  ): Promise<object> {
    const businessProduct: IProduct = createBusinessProduct(subscriptionType);
    const token = await this.authentication();
    return await axios.post(
      'https://api-m.sandbox.paypal.com/v1/catalogs/products',
      businessProduct,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Prefer: 'return=minimal',
        },
      },
    );
  }

  private async listProducts() {
    const token = await this.authentication();
    return (
      await axios.get(
        'https://api-m.sandbox.paypal.com/v1/catalogs/products?page_size=10&page=1&total_required=true',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
    ).data;
  }

  async createPlan(
    subscriptionType: SubscriptionType,
    name: string,
    description: string,
  ) {
    const products = await this.listProducts();
    const price = getSubscriptionPrice(subscriptionType);
    const product = products.products.filter((product) => {
      const jsonSubscriptionType = JSON.parse(product.description);
      if (jsonSubscriptionType.subscriptionType === subscriptionType) {
        product.description = JSON.parse(product.description);
        return product;
      }
    });
    const token = await this.authentication();

    const plan = createBusinessPlan(
      name,
      subscriptionType,
      product,
      price,
      description,
    );

    const planResponse = await axios.post(
      'https://api-m.sandbox.paypal.com/v1/billing/plans',
      JSON.stringify(plan),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Prefer: 'return=minimal',
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );
  }

  async listPlans() {
    const token = await this.authentication();
    return (
      await axios.get(
        'https://api-m.sandbox.paypal.com/v1/billing/plans?sort_by=create_time&sort_order=desc',

        {
          headers: {
            Authorization: `Bearer ${token}`,
            Prefer: 'return=minimal',
          },
        },
      )
    ).data;
  }
}

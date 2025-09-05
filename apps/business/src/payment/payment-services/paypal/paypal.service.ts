import { IPaymentService } from '../../interfaces/payment-service.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EnvironmentMode } from '../../../settings/configuration';
import { createBusinessProduct } from './helpers/create-business-product.helper';
import { SubscriptionType } from '../../../../../../apps/libs/Business/constants/subscription-type.enum';
import { IProduct } from './interfaces/product.interface';
import { getSubscriptionPrice } from '../../../../../../apps/business/src/helper/get-subscription-price.helper';
import { Client, Environment, LogLevel } from '@paypal/paypal-server-sdk';
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

  async createProduct(subscriptionType: SubscriptionType): Promise<object> {
    const businessProduct: IProduct = createBusinessProduct(subscriptionType);
    const token = await this.authentication();
    return (
      await axios.post(
        'https://api-m.sandbox.paypal.com/v1/catalogs/products',
        businessProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Prefer: 'return=minimal',
          },
        },
      )
    ).data;
  }

  async listProducts() {
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

  async getProduct(id: string) {
    const token = await this.authentication();
    return (
      await axios.get(
        `https://api-m.sandbox.paypal.com/v1/catalogs/products/${id}`,
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
    productId: string,
    name: string,
    description: string,
  ): Promise<object> {
    const product = await this.getProduct(productId);
    if (!product)
      throw new NotFoundException(
        'Paypal service error: product does not exist',
      );
    const price = getSubscriptionPrice(subscriptionType);
    const token = await this.authentication();

    const plan = createBusinessPlan(
      name,
      subscriptionType,
      productId,
      price,
      description,
    );

    return (
      await axios.post(
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
      )
    ).data;
  }

  async listPlans() {
    const token = await this.authentication();
    return (
      await axios.get(
        'https://api-m.sandbox.paypal.com/v1/billing/plans?sort_by=create_time&sort_order=desc',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Prefer: 'return=representation',
          },
        },
      )
    ).data;
  }

  async getPlan(id: string): Promise<any> {
    const token = await this.authentication();
    return (
      await axios.get(
        `https://api-m.sandbox.paypal.com/v1/billing/plans/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
    ).data;
  }

  async subscribeToPlan(subscriptionType: SubscriptionType): Promise<any> {
    const plans = await this.listPlans();
    const subscriptionPrice = getSubscriptionPrice(subscriptionType);
    let plan = {};
    for (let i = 0; i < plans.plans.length; i++) {
      if (plans.plans[i].status === 'ACTIVE') {
        const price = Number(
          plans.plans[i].billing_cycles[0].pricing_scheme.fixed_price.value,
        );
        if (price == subscriptionPrice) {
          plan = plans.plans[i];
          break;
        }
      }
    }
    if (!plan)
      throw new BadRequestException('Paypal error: plan does not exist');
    const token = await this.authentication();
    const today = new Date();
    const nextDay = new Date(today.setDate(today.getDate() + 1)).toISOString();
    const subscribe = {
      plan_id: plan['id'],
      quantity: 1,
      start_time: nextDay,
    };

    const response = await axios.post(
      'https://api-m.sandbox.paypal.com/v1/billing/subscriptions',
      subscribe,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Prefer: 'return=minimal',
        },
      },
    );
    const link = response.data.links.filter((link) => {
      if (link.rel === 'approve') {
        return link.href;
      }
    })[0].href;
    console.log('link:', link);
    const responseDto = {
      status: response.data.status,
      id: response.data.id,
      createTime: response.data.create_time,
      link: response.data.links.filter((link) => {
        if (link.rel === 'approve') {
          return link.href;
        }
      })[0].href,
    };
    return responseDto;
  }

  async suspendSubscription(id: string): Promise<any> {
    const token = await this.authentication();
    await axios.post(
      `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${id}/suspend`,
      JSON.stringify({}),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );
  }

  async getSubscription(id: string): Promise<any> {
    const token = await this.authentication();
    return (
      await axios.get(
        `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
    ).data;
  }

  async deactivatePlan(id: string) {
    const token = await this.authentication();
    await axios.post(
      `https://api-m.sandbox.paypal.com/v1/billing/plans/${id}/deactivate`,
      JSON.stringify({}),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );
  }
}

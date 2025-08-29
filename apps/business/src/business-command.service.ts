import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SubscribeDto } from '../../libs/Business/dto/input/subscribe.dto';
import { Payment } from './infrastructure/entity/payment.entity';
import { IPaymentCommandRepository } from './interfaces/payment-command-repository.interface';
import { getSubscriptionPrice } from './helper/get-subscription-price.helper';
import { IPaymentService } from './payment/interfaces/payment-service.interface';
import { v4 } from 'uuid';

@Injectable()
export class BusinessCommandService {
  constructor(
    private readonly paymentCommandRepository: IPaymentCommandRepository<Payment>,
    private readonly paymentService: IPaymentService,
  ) {}

  async updatePlan(updatePlan: SubscribeDto): Promise<string> {
    try {
      return await this.paymentService.subscribeToPlan(
        updatePlan.id,
        updatePlan.paymentType,
        updatePlan.subscriptionType,
      );
    } catch (err) {
      if (err.response.httpStatusCode) {
        throw new HttpException(err.response, err.response.httpStatusCode);
      }
      throw new InternalServerErrorException(
        'BusinessCommandService error: plan was not updated',
      );
    }
  }

  async capturePayment(token: string): Promise<string> {
    try {
      const { status, subscriptions } =
        await this.paymentService.capturePayment(token);
      if (status !== 'COMPLETED')
        throw new InternalServerErrorException(
          'PayPalService error: capturing order',
        );
      const price = getSubscriptionPrice(subscriptions.subscriptionType);
      const paymentDate = new Date();
      let expiresAt = structuredClone(paymentDate);
      expiresAt = new Date(
        expiresAt.setDate(
          paymentDate.getDate() + subscriptions.subscriptionType,
        ),
      );
      const updatePlanObject: Payment = {
        id: v4(),
        userId: subscriptions.userId,
        paymentType: subscriptions.paymentType,
        subscriptionType: subscriptions.subscriptionType,
        price,
        paymentDate,
        expiresAt,
      };

      await this.paymentCommandRepository.updatePlan(updatePlanObject);
      return 'success';
    } catch (err) {
      if (err.response.httpStatusCode) {
        throw new HttpException(err.response, err.response.httpStatusCode);
      }
      throw new InternalServerErrorException(
        'BusinessCommandService error: plan was not updated',
      );
    }
  }
}

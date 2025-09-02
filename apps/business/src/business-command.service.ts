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
import { SaveSubscriptionDto } from './payment/payment-services/paypal/dto/save-subscription.dto';
import { DataSource } from 'typeorm';
import { Subscription } from './infrastructure/entity/subscription.entity';

@Injectable()
export class BusinessCommandService {
  constructor(
    private readonly paymentCommandRepository: IPaymentCommandRepository<
      Payment,
      Subscription
    >,
    private readonly paymentService: IPaymentService,
    private readonly dataSource: DataSource,
  ) {}

  async updatePlan(updatePlan: SubscribeDto): Promise<string> {
    try {
      return await this.paymentService.subscribeToPlan(
        updatePlan.userId,
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
      // const updatePlanObject: Payment = {
      //   id: v4(),
      //   userId: subscriptions.userId,
      //   paymentType: subscriptions.paymentType,
      //   subscriptionType: subscriptions.subscriptionType,
      //   price,
      //   paymentDate,
      //   expiresAt,
      // };

      // await this.paymentCommandRepository.updatePlan(updatePlanObject);
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

  async saveSubscription(saveSubscriptionDto: SaveSubscriptionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const price = getSubscriptionPrice(saveSubscriptionDto.subscriptionType);
    try {
      const updatePlanDto = {
        subscriptionType: saveSubscriptionDto.subscriptionType,
        userId: saveSubscriptionDto.userId,
        paymentType: saveSubscriptionDto.paymentType,
        price,
      };

      await queryRunner.startTransaction('READ COMMITTED');
      const payment = await this.paymentCommandRepository.savePayment(
        updatePlanDto,
        queryRunner.manager,
      );
      saveSubscriptionDto.paymentId = payment.id;
      saveSubscriptionDto.payment = [payment];
      const subscription = await this.paymentCommandRepository.saveSubscription(
        saveSubscriptionDto,
        queryRunner.manager,
      );
      console.log(
        '🚀 ~ BusinessCommandService ~ saveSubscription ~ subscription:',
        subscription,
      );
      await queryRunner.commitTransaction();
      return subscription;
    } catch (err) {
      console.log('🚀 ~ BusinessCommandService ~ saveSubscription ~ err:', err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}

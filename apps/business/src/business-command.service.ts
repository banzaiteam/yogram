import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SubscribeDto } from '../../libs/Business/dto/input/subscribe.dto';
import { Payment } from './infrastructure/entity/payment.entity';
import { IPaymentCommandRepository } from './interfaces/payment-command-repository.interface';
import { getSubscriptionPrice } from './helper/get-subscription-price.helper';
import { IPaymentService } from './payment/interfaces/payment-service.interface';
import { SaveSubscriptionDto } from './payment/payment-services/paypal/dto/save-subscription.dto';
import { DataSource, EntityManager } from 'typeorm';
import { Subscription } from './infrastructure/entity/subscription.entity';
import { SubscriptionStatus } from './payment/payment-services/paypal/constants/subscription-status.enum';

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

  async subscribe(subscribeDto: SubscribeDto): Promise<any> {
    try {
      const response = await this.paymentService.subscribeToPlan(
        subscribeDto.subscriptionType,
      );
      const saveSubscriptionDto: SaveSubscriptionDto = {
        paymentType: subscribeDto.paymentType,
        subscriptionType: subscribeDto.subscriptionType,
        status: response.status,
        subscriptionId: response.id,
        userId: subscribeDto.userId,
      };
      await this.paymentCommandRepository.saveSubscription(saveSubscriptionDto);
      return response;
    } catch (err) {
      console.log('🚀 ~ BusinessCommandService ~ subscribe ~ err:', err);
      if (err.response.httpStatusCode) {
        throw new HttpException(err.response, err.response.httpStatusCode);
      }
      throw new InternalServerErrorException(
        'BusinessCommandService error: subscription error',
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

  async saveSubscription(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');
    try {
      let [subscription, paypalSubscription] = await Promise.all([
        await this.paymentCommandRepository.getSubscription(
          id,
          queryRunner.manager,
        ),
        await this.paymentService.getSubscription(id),
      ]);
      if (!subscription || !paypalSubscription)
        throw new NotFoundException(
          'BusinessCommandService error: subscription not found',
        );
      const price = getSubscriptionPrice(subscription.subscriptionType);
      const updatePlanDto = {
        subscriptionType: subscription.subscriptionType,
        userId: subscription.userId,
        paymentType: subscription.paymentType,
        price,
      };

      const payment = await this.paymentCommandRepository.savePayment(
        updatePlanDto,
        queryRunner.manager,
      );
      const startDate = new Date(paypalSubscription.start_time);
      const startDateCopy = structuredClone(startDate);
      const expiresAt = new Date(
        startDateCopy.setDate(
          startDateCopy.getDate() + subscription.subscriptionType,
        ),
      );
      subscription.paymentId = payment.id;
      subscription.payments = [payment];
      subscription.startAt = startDate;
      subscription.expiresAt = expiresAt;
      subscription.status = SubscriptionStatus.Active;

      await this.paymentCommandRepository.saveSubscription(
        subscription,
        queryRunner.manager,
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

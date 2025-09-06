import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SubscribeDto } from '../../libs/Business/dto/input/subscribe.dto';
import { Payment } from './infrastructure/entity/payment.entity';
import { IBusinessCommandRepository } from './interfaces/business-command-repository.interface';
import { getSubscriptionPrice } from './helper/get-subscription-price.helper';
import { IPaymentService } from './payment/interfaces/payment-service.interface';
import { SaveSubscriptionDto } from './payment/payment-services/paypal/dto/save-subscription.dto';
import { Subscription } from './infrastructure/entity/subscription.entity';
import { SubscriptionStatus } from './payment/payment-services/paypal/constants/subscription-status.enum';
import { DataSource } from 'typeorm';
import { BusinessQueryService } from './business-query.service';

@Injectable()
export class BusinessCommandService {
  constructor(
    private readonly businessCommandRepository: IBusinessCommandRepository<
      Payment,
      Subscription
    >,
    private readonly paymentService: IPaymentService,
    private readonly businessQueryService: BusinessQueryService,
    private readonly dataSource: DataSource,
  ) {}

  async subscribe(subscribeDto: SubscribeDto): Promise<any> {
    const currentSubscriptions =
      await this.businessQueryService.getCurrentUserSubscriptions(
        subscribeDto.userId,
      );
    // if (currentSubscriptions.length > 1) {
    //   throw new BadRequestException(
    //     'BusinessCommandService error: user cant have more than 2 not expired subscriptions simultaniously',
    //   );
    // }
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
    await this.businessCommandRepository.saveSubscription(saveSubscriptionDto);
    return response;
  }

  async saveSubscription(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let [subscription, paypalSubscription] = await Promise.all([
        await this.businessQueryService.getSubscription(id),
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

      const payment = await this.businessCommandRepository.savePayment(
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

      await this.businessCommandRepository.saveSubscription(
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

  async suspendSubscription(id: string): Promise<any> {
    const subscription = await this.businessQueryService.getSubscription(id);
    if (!subscription)
      throw new NotFoundException(
        'BusinessCommandService error: subscription does not exist',
      );
    await this.paymentService.suspendSubscription(id);
    subscription.status = SubscriptionStatus.Suspended;
    return await this.businessCommandRepository.saveSubscription(subscription);
  }
}

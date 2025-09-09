import {
  BadRequestException,
  HttpException,
  Injectable,
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
import { DataSource, EntityManager } from 'typeorm';
import { BusinessQueryService } from './business-query.service';
import { SubscriptionUpdateDto } from './dto/subscription-update.dto';

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

    if (currentSubscriptions.length > 1) {
      throw new BadRequestException(
        'BusinessCommandService error: user cant have more than 2 not expired subscriptions simultaniously',
      );
    }

    currentSubscriptions.map((subscription) => {
      if (
        new Date(subscription.expiresAt) > new Date() &&
        subscription.subscriptionType === subscribeDto.subscriptionType
      ) {
        throw new BadRequestException(
          'BusinessCommandService error: you cant have 2 subscriptions with the same subscription type',
        );
      }
    });
    //* if we already have subscription and buy a new one, the new one subscription should start on the day when the first subscription expires
    const start_date =
      currentSubscriptions.length === 1
        ? new Date(currentSubscriptions[0].expiresAt)
        : new Date();

    const response = await this.paymentService.subscribeToPlan(
      subscribeDto.subscriptionType,
      currentSubscriptions.length === 1 ? start_date.toISOString() : undefined,
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
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      let [subscription, paypalSubscription] = await Promise.all([
        await this.businessQueryService.getSubscription(id),
        await this.paymentService.getSubscription(id),
      ]);
      if (!subscription || !paypalSubscription)
        throw new NotFoundException(
          'BusinessCommandService error: subscription not found',
        );
      const currentSubscriptionsArr =
        await this.businessQueryService.getCurrentUserSubscriptions(
          subscription.userId,
        );
      //todo* the second one subscription should starts from end of the first one (get first expiresAt, get time difference between now and first expiresAt, add this to startAt of the new subscription)
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
      //* expires+1 when it second subscription
      const startDate = new Date(
        currentSubscriptionsArr.length === 1
          ? currentSubscriptionsArr[0].expiresAt
          : paypalSubscription.start_time,
      );

      const startDateCopy = structuredClone(startDate);
      const expiresAt = new Date(
        startDateCopy.setDate(
          startDateCopy.getDate() + subscription.subscriptionType,
        ),
      );
      subscription.paymentId = payment.id;
      subscription.payments = [payment];
      subscription.startAt = new Date(
        startDate.setHours(startDate.getHours() + 8),
      );

      subscription.expiresAt = new Date(
        expiresAt.setHours(expiresAt.getHours() + 8),
      );
      subscription.status = SubscriptionStatus.Active;

      await this.businessCommandRepository.saveSubscription(
        subscription,
        queryRunner.manager,
      );

      //* all next need to toggle first subscription to suspended if we create second subscription
      const currentSubscriptions =
        await this.businessQueryService.getCurrentUserSubscriptions(
          subscription.userId,
          queryRunner.manager,
        );
      const firstSubscription: Subscription[] = currentSubscriptions.filter(
        (subscr) => subscr.id !== subscription.id,
      );
      if (currentSubscriptions.length === 2) {
        firstSubscription[0].status = SubscriptionStatus.Suspended;
        await this.suspendSubscription(firstSubscription[0].subscriptionId);
      }
      await queryRunner.commitTransaction();
      return subscription;
    } catch (err) {
      console.log('🚀 ~ BusinessCommandService ~ saveSubscription ~ err:', err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async activateSubscription(id: string): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');
    try {
      const subscription = await this.businessQueryService.getSubscription(
        id,
        queryRunner.manager,
      );
      if (!subscription)
        throw new NotFoundException(
          'BusinessCommandService error: subscription does not exist',
        );
      const currentSubscriptions =
        await this.businessQueryService.getCurrentUserSubscriptions(
          subscription.userId,
          queryRunner.manager,
        );
      await this.paymentService.activateSubscription(id);

      subscription.status = SubscriptionStatus.Active;
      const updatedSubscription =
        await this.businessCommandRepository.saveSubscription(
          subscription,
          queryRunner.manager,
        );

      if (currentSubscriptions.length === 2) {
        const anotherSubscription: Subscription[] = currentSubscriptions.filter(
          (subscr) => subscr.id !== subscription.id,
        );
        await this.suspendSubscription(
          anotherSubscription[0].subscriptionId,
          queryRunner.manager,
        );
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log('BusinessCommandService activateSubscription ~ err:', err);
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        err.response,
        err.response.httpStatusCode || err.httpStatusCode,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async suspendSubscription(
    id: string,
    entityManager?: EntityManager,
  ): Promise<any> {
    const subscription = await this.businessQueryService.getSubscription(id);
    if (!subscription)
      throw new NotFoundException(
        'BusinessCommandService error: subscription does not exist',
      );
    await this.paymentService.suspendSubscription(id);
    subscription.status = SubscriptionStatus.Suspended;
    return await this.businessCommandRepository.saveSubscription(
      subscription,
      entityManager,
    );
  }

  async updateSubscription(
    id: string,
    subscriptionUpdateDto: SubscriptionUpdateDto,
  ) {
    const subscription = await this.businessQueryService.getSubscription(id);
    if (!subscription)
      throw new NotFoundException(
        'BusinessCommandService error: subscription does not exist',
      );
    subscription.expiresAt = subscriptionUpdateDto.expiresAt;
    const price = getSubscriptionPrice(subscription.subscriptionType);
    const paymentDto = {
      subscriptionType: subscription.subscriptionType,
      userId: subscription.userId,
      paymentType: subscription.paymentType,
      price,
    };
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const updatedSubscription =
        await this.businessCommandRepository.saveSubscription(subscription);
      console.log(
        '🚀 ~ BusinessCommandService ~ updateSubscription ~ updatedSubscription:',
        updatedSubscription,
      );
      const savedPayment =
        await this.businessCommandRepository.savePayment(paymentDto);
      await queryRunner.commitTransaction();
      return updatedSubscription;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        err.response,
        err.response.httpStatusCode || err.httpStatusCode,
      );
    } finally {
      await queryRunner.release();
    }
  }
}

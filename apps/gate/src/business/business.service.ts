import { PaymentsPaginatedResponseDto } from '../../../../apps/libs/Business/dto/response/payments-paginated-response.dto';
import { INotification } from '../../../../apps/libs/common/notifications/interfaces/notification.interface';
import { Subscription } from '../../../../apps/business/src/infrastructure/entity/subscription.entity';
import { IPagination } from '../../../../apps/libs/common/pagination/decorators/pagination.decorator';
import { SubscriptionsSse } from '../../../../apps/libs/Business/dto/response/subscriptions-sse.dto';
import { ISorting } from '../../../../apps/libs/common/pagination/decorators/sorting.decorator';
import { HttpBusinessPath } from '../../../../apps/libs/Business/constants/path.constant';
import { HttpServices } from '../../../../apps/gate/common/constants/http-services.enum';
import { PaymentType } from '../../../../apps/libs/Business/constants/payment-type.enum';
import { SubscribeDto } from '../../../../apps/libs/Business/dto/input/subscribe.dto';
import { GateService } from '../../../../apps/libs/gateService';
import { Injectable } from '@nestjs/common';
import { NotificationsService } from 'apps/libs/common/notifications/notifications.service';

@Injectable()
export class BusinessService {
  constructor(
    private readonly gateService: GateService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async subscribe(
    subscribeDto: SubscribeDto,
    payment: PaymentType,
  ): Promise<any> {
    const path = [HttpBusinessPath.Subscribe, `payment=${payment}`].join('?');
    return await this.gateService.requestHttpServicePost(
      HttpServices.Business,
      path,
      subscribeDto,
      {},
    );
  }

  async paypalProccess(
    subscriptionId: string,
    payment: PaymentType,
  ): Promise<void> {
    console.log('🚀 ~ BusinessService ~ paypalProccess ~ payment:', payment);
    console.log(
      '🚀 ~ BusinessService ~ paypalProccess ~ subscriptionId:',
      subscriptionId,
    );
    const path = [HttpBusinessPath.PaypalProcess, `payment=${payment}`].join(
      '?',
    );
    console.log('🚀 ~ BusinessService ~ paypalProccess ~ path:', path);
    return await this.gateService.requestHttpServicePost(
      HttpServices.Business,
      path,
      { subscriptionId },
      {},
    );
  }

  async subscriptioExpiredEvent(
    subscriptionId: string,
    payment: PaymentType,
  ): Promise<Subscription> {
    const path = [
      HttpBusinessPath.SubscriptionsExpired,
      `payment=${payment}`,
    ].join('?');
    return await this.gateService.requestHttpServicePost(
      HttpServices.Business,
      path,
      { subscriptionId },
      {},
    );
  }

  async subscriptioUpdatedEvent(subscriptionId: any, payment: PaymentType) {
    const path = [
      HttpBusinessPath.SubscriptionsUpdated,
      `payment=${payment}`,
    ].join('?');
    return await this.gateService.requestHttpServicePost(
      HttpServices.Business,
      path,
      { subscriptionId },
      {},
    );
  }

  async postPaypalSse(subscriptionSse: SubscriptionsSse, payment: PaymentType) {
    console.log(
      '🚀 ~ BusinessService ~ postPaypalSse ~ subscriptionSse:',
      subscriptionSse,
    );
    const path = [HttpBusinessPath.PostPaypalSse, `payment=${payment}`].join(
      '?',
    );
    return await this.gateService.requestHttpServicePost(
      HttpServices.Business,
      path,
      subscriptionSse,
      {},
    );
  }

  async getCurrentSubscriptions(id: string): Promise<Subscription[]> {
    const path = [
      [HttpBusinessPath.CurrentSubscriptions, id].join('/'),
      `payment=paypal`,
    ].join('?');
    return await this.gateService.requestHttpServiceGet(
      HttpServices.Business,
      path,
      {},
    );
  }

  async suspendSubscription(id: string, payment: PaymentType): Promise<void> {
    const path = [
      [HttpBusinessPath.SuspendSubscription.replace(':id', id)].join('/'),
      `payment=${payment}`,
    ].join('?');
    return await this.gateService.requestHttpServicePatch(
      HttpServices.Business,
      path,
      {},
      {},
    );
  }

  async activateSubscription(id: string, payment: PaymentType): Promise<void> {
    const path = [
      [HttpBusinessPath.ActivateSubscription.replace(':id', id)].join('/'),
      `payment=${payment}`,
    ].join('?');
    return await this.gateService.requestHttpServicePatch(
      HttpServices.Business,
      path,
      {},
      {},
    );
  }

  async cancelSubscription(id: string, payment: PaymentType): Promise<void> {
    const path = [
      [HttpBusinessPath.CancelSubscription.replace(':id', id)].join('/'),
      `payment=${payment}`,
    ].join('?');
    return await this.gateService.requestHttpServicePatch(
      HttpServices.Business,
      path,
      {},
      {},
    );
  }

  async getPayments(
    payment: PaymentType,
    pagination: IPagination,
    sorting: ISorting,
    filter: string,
  ): Promise<PaymentsPaginatedResponseDto> {
    const query = [
      `payment=${payment}`,
      `page=${pagination.page}&limit=${pagination.limit}`,
      sorting ? `${sorting.property}:${sorting.direction}` : `createdAt:asc`,
      filter,
    ].join('&');
    const path = [HttpBusinessPath.Payments, query].join('?');
    return await this.gateService.requestHttpServiceGet(
      HttpServices.Business,
      path,
      {},
    );
  }

  //  async subscriptionActivatedEvent(subscription: void) {
  //   await this
  // }

  async getUserNotifications(userId: string): Promise<INotification[]> {
    // const path = [HttpBusinessPath.GetNotifications, userId].join('/');
    // return await this.gateService.requestHttpServiceGet(
    //   HttpServices.Business,
    //   path,
    //   {},
    // );
    return await this.notificationsService.getUserNotifications(userId);
  }

  async readNotification(notificationId: string): Promise<void> {
    // return await this.gateService.requestHttpServicePatch(
    //   HttpServices.Business,
    //   HttpBusinessPath.ReadNotification,
    //   { notificationId },
    //   {},
    // );
    return await this.notificationsService.updateNotification(notificationId);
  }
}

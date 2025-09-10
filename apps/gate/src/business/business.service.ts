import { HttpServices } from '../../../../apps/gate/common/constants/http-services.enum';
import { HttpBusinessPath } from '../../../../apps/libs/Business/constants/path.constant';
import { PaymentType } from '../../../../apps/libs/Business/constants/payment-type.enum';
import { SubscribeDto } from '../../../../apps/libs/Business/dto/input/subscribe.dto';
import { GateService } from '../../../../apps/libs/gateService';
import { Subscription } from '../../../../apps/business/src/infrastructure/entity/subscription.entity';
import { IPagination } from '../../../../apps/libs/common/pagination/decorators/pagination.decorator';
import { ISorting } from '../../../../apps/libs/common/pagination/decorators/sorting.decorator';
import { PaymentsPaginatedResponseDto } from '../../../../apps/libs/Business/dto/response/payments-paginated-response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BusinessService {
  constructor(private readonly gateService: GateService) {}

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
}

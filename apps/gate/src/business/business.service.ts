import { Injectable } from '@nestjs/common';
import { HttpServices } from '../../../../apps/gate/common/constants/http-services.enum';
import { HttpBusinessPath } from '../../../../apps/libs/Business/constants/path.constant';
import { PaymentType } from '../../../../apps/libs/Business/constants/payment-type.enum';
import { SubscribeDto } from '../../../../apps/libs/Business/dto/input/subscribe.dto';
import { GateService } from '../../../../apps/libs/gateService';
import { Subscription } from '../../../../apps/business/src/infrastructure/entity/subscription.entity';

@Injectable()
export class BusinessService {
  constructor(private readonly gateService: GateService) {}
  async subscribe(
    subscribeDto: SubscribeDto,
    payment: PaymentType,
  ): Promise<any> {
    const path = [HttpBusinessPath.Subscribe, `payment=${payment}`].join('?');
    const response = await this.gateService.requestHttpServicePost(
      HttpServices.Business,
      path,
      subscribeDto,
      {},
    );
  }

  async getCurrentSubscriptions(id: string): Promise<Subscription[]> {
    const path = [HttpBusinessPath.CurrentSubscriptions, id].join('/');
    return await this.gateService.requestHttpServiceGet(
      HttpServices.Business,
      path,
      {},
    );
  }

  async suspendSubscription(id: string): Promise<void> {
    const path = [HttpBusinessPath.SuspendSubscription.replace(':id', id)].join(
      '/',
    );
    return await this.gateService.requestHttpServicePatch(
      HttpServices.Business,
      path,
      {},
      {},
    );
  }
}

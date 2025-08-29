import { EntityManager } from 'typeorm';
import { UpdatePlanDto } from '../../../libs/Business/dto/input/subscribe.dto';

export abstract class IPaymentCommandRepository<R> {
  abstract updatePlan(
    updatePlanDto: UpdatePlanDto,
    entityManager?: EntityManager,
  ): Promise<R>;
}

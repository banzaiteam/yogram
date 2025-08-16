import { EntityManager } from 'typeorm';
import { UpdatePlanDto } from '../../../../apps/libs/Business/dto/input/update-plan.dto';

export abstract class IPaymentCommandRepository<R> {
  abstract updatePlan(
    updatePlanDto: UpdatePlanDto,
    entityManager?: EntityManager,
  ): Promise<R>;
}

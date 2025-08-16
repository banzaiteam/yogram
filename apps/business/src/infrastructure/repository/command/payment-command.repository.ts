import { IPaymentCommandRepository } from '../../../../../../apps/business/src/interfaces/payment-command-repository.interface';
import { Payment } from '../../entity/payment.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentCommandRepository
  implements IPaymentCommandRepository<Payment>
{
  constructor(
    @InjectRepository(Payment)
    private readonly paymentCommandRepository: Repository<Payment>,
  ) {}
  async updatePlan(
    updatePlanDto: Payment,
    entityManager?: EntityManager,
  ): Promise<Payment> {
    const payment = new Payment(updatePlanDto);
    if (entityManager) {
      return await entityManager.save(payment);
    }
    return await this.paymentCommandRepository.save(payment);
  }
}

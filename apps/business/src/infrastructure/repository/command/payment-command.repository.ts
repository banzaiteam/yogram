import { IPaymentCommandRepository } from '../../../../../../apps/business/src/interfaces/payment-command-repository.interface';
import { Payment } from '../../entity/payment.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Subscription } from '../../entity/subscription.entity';
import { SaveSubscriptionDto } from '../../../../../../apps/business/src/payment/payment-services/paypal/dto/save-subscription.dto';

@Injectable()
export class PaymentCommandRepository
  implements IPaymentCommandRepository<Payment, Subscription>
{
  constructor(
    @InjectRepository(Payment)
    private readonly paymentCommandRepository: Repository<Payment>,
  ) {}
  async savePayment(
    updatePlanDto: Payment,
    entityManager?: EntityManager,
  ): Promise<Payment> {
    const payment = new Payment(updatePlanDto);
    if (entityManager) {
      return await entityManager.save(payment);
    }
    return await this.paymentCommandRepository.save(payment);
  }

  async saveSubscription(
    saveSubscriptionDto: SaveSubscriptionDto,
    entityManager?: EntityManager,
  ): Promise<Subscription> {
    const subscription = new Subscription(saveSubscriptionDto);
    if (entityManager) {
      return await entityManager.save(subscription);
    }
    return await this.paymentCommandRepository.save(subscription);
  }
}

import { IBusinessCommandRepository as IBusinessCommandRepository } from '../../../interfaces/business-command-repository.interface';
import { Payment } from '../../entity/payment.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Subscription } from '../../entity/subscription.entity';
import { SaveSubscriptionDto } from '../../../payment/payment-services/paypal/dto/save-subscription.dto';

@Injectable()
export class BusinessCommandRepository
  implements IBusinessCommandRepository<Payment, Subscription>
{
  constructor(
    @InjectRepository(Payment)
    private readonly paymentCommandRepository: Repository<Payment>,
    @InjectRepository(Subscription)
    private readonly subscriptionCommandRepository: Repository<Subscription>,
  ) {}
  async savePayment(
    updatePlanDto: any,
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
    return await this.subscriptionCommandRepository.save(subscription);
  }
}

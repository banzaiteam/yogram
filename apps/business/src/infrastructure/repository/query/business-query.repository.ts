import { Injectable } from '@nestjs/common';
import { IBusinessQueryRepository } from '../../../../../../apps/business/src/interfaces/business-query-repository.interface';
import { Payment } from '../../entity/payment.entity';
import { Subscription } from '../../entity/subscription.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BusinessQueryRepository
  implements IBusinessQueryRepository<Payment, Subscription>
{
  constructor(
    @InjectRepository(Payment)
    private readonly paymentQueryRepository: Repository<Payment>,
    @InjectRepository(Subscription)
    private readonly subscriptionQueryRepository: Repository<Subscription>,
  ) {}

  async getUserSubscriptions(id: string): Promise<Subscription[]> {
    return await this.subscriptionQueryRepository.find({
      where: { userId: id },
    });
  }

  async getSubscription(id: string): Promise<Subscription> {
    return await this.subscriptionQueryRepository.findOneBy({
      subscriptionId: id,
    });
  }
}

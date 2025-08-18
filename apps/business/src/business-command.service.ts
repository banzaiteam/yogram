import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdatePlanDto } from '../../libs/Business/dto/input/update-plan.dto';
import { Payment } from './infrastructure/entity/payment.entity';
import { IPaymentCommandRepository } from './interfaces/payment-command-repository.interface';
import { v4 } from 'uuid';
import { SubscriptionType } from '../../../apps/libs/Business/constants/subscription-type.enum';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { getSubscriptionPrice } from './helper/get-subscription-price.helper';
import { IPaymentService } from './payment/interfaces/payment-service.interface';

@Injectable()
export class BusinessCommandService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly paymentCommandRepository: IPaymentCommandRepository<Payment>,
    private readonly configService: ConfigService,
    private readonly paymentService: IPaymentService,
  ) {}

  async updatePlan(updatePlan: UpdatePlanDto): Promise<Payment> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const price = getSubscriptionPrice(updatePlan.subscriptionType);
      const paymentDate = new Date();
      let expiresAt = structuredClone(paymentDate);
      expiresAt = new Date(
        expiresAt.setDate(paymentDate.getDate() + updatePlan.subscriptionType),
      );
      const updatePlanObject: Payment = {
        id: v4(),
        userId: updatePlan.id,
        paymentType: 'paypal',
        subscriptionType: updatePlan.subscriptionType,
        price,
        paymentDate,
        expiresAt,
      };
      await queryRunner.startTransaction();
      const updatedPlan = await this.paymentCommandRepository.updatePlan(
        updatePlanObject,
        queryRunner.manager,
      );
      await this.paymentService.pay('s', SubscriptionType.Month);
      await queryRunner.commitTransaction();
      return updatedPlan;
    } catch (err) {
      console.log('🚀 ~ BusinessCommandService ~ updatePlan ~ err:', err);
      await queryRunner.rollbackTransaction();
      if (err.response.httpStatusCode) {
        console.log('errrrr');

        throw new HttpException(err.response, err.response.httpStatusCode);
      }
      throw new InternalServerErrorException(
        'BusinessCommandService error: plan was not updated',
      );
    } finally {
      await queryRunner.release();
    }
  }
}

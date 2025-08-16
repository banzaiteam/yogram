import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePlanDto } from '../../../../../apps/libs/Business/dto/input/update-plan.dto';
import { BusinessCommandService } from '../../business-command.service';

export class UpdatePlanCommand {
  constructor(public readonly updatePlan: UpdatePlanDto) {}
}

@CommandHandler(UpdatePlanCommand)
export class UpdatePlanHandler implements ICommandHandler<UpdatePlanCommand> {
  constructor(private readonly businessService: BusinessCommandService) {}

  async execute({ updatePlan }: UpdatePlanCommand): Promise<void> {
    const result = await this.businessService.updatePlan(updatePlan);
    console.log('🚀 ~ UpdatePlanHandler ~ execute ~ result:', result);
  }
}

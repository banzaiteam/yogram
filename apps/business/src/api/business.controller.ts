import { Body, Controller, Get, Post } from '@nestjs/common';
import { UpdatePlanDto } from '../../../../apps/libs/Business/dto/input/update-plan.dto';
import { CommandBus } from '@nestjs/cqrs';
import { UpdatePlanCommand } from '../application/command/update-plan.handler';

@Controller()
export class BusinessController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('business/update-plan')
  async updatePlan(@Body() updatePlan: UpdatePlanDto): Promise<void> {
    return await this.commandBus.execute(new UpdatePlanCommand(updatePlan));
  }
}

import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { UpdatePlanDto } from '../../../../apps/libs/Business/dto/input/update-plan.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdatePlanCommand } from '../application/command/update-plan.handler';
import { PayPalCapturePaymentCommand } from '../application/command/paypal-capture-payment.handler';
import { Request, Response } from 'express';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class BusinessController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('business/update-plan')
  async updatePlan(
    @Body() updatePlan: UpdatePlanDto,
    @Res() res: Response,
  ): Promise<void> {
    const link = await this.commandBus.execute(
      new UpdatePlanCommand(updatePlan),
    );
    res.redirect(link);
  }

  @ApiExcludeEndpoint()
  @Get('business/paypal-capture')
  async paypalSuccess(@Query('token') token: string): Promise<string> {
    return await this.commandBus.execute(
      new PayPalCapturePaymentCommand(token),
    );
  }

  @Post('business/paypal-hook')
  async paypalHook(@Req() req: Request, @Res() res: Response) {
    try {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      res.flushHeaders();
      const data = req.body;
      res.write(`data: ${JSON.stringify(data)}\n\n`);

      req.on('close', () => {
        res.end();
      });
    } catch (error) {
      console.log('BusinessController ~ business/paypal-hook ~ error:', error);
      res.write(`data: ${error}\n\n`);
    }
  }
}

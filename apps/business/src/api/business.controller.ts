import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { UpdatePlanDto } from '../../../../apps/libs/Business/dto/input/update-plan.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdatePlanCommand } from '../application/command/update-plan.handler';
import { PayPalSuccessQuery } from '../application/query/paypal-success.handler';
import { Request, Response } from 'express';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { PaypalPaymentDto } from 'apps/libs/Business/dto/input/paypal-payment.dto';

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
    console.log(
      '🚀 ~ BusinessController ~ updatePlan ~ updatePlan:',
      updatePlan,
    );
    const link = await this.commandBus.execute(
      new UpdatePlanCommand(updatePlan),
    );
    res.redirect(link);
    return link;
  }

  @ApiExcludeEndpoint()
  @Get('business/paypal-success')
  async paypalSuccess(
    @Query('PayerID') PayerID: string,
    @Query('paymentId') paymentId: string,
  ): Promise<string> {
    const paypalPaymentDto: PaypalPaymentDto = {
      PayerID,
      paymentId,
    };
    return await this.queryBus.execute(
      new PayPalSuccessQuery(paypalPaymentDto),
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

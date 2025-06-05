import { Controller, Post } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() { }

  @Post()
  async hi(): Promise<string> {
    return 'res';
  }
}

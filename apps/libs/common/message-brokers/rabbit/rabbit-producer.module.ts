import { DynamicModule, Module } from '@nestjs/common';
import { ProducerService } from './providers/producer.service';
import { ConfigModule } from '@nestjs/config';

export const RMQ_PRODUCER_QUEUE_LIST = 'RMQ_PRODUCER_QUEUE_LIST';

/**
 * RabbitProducerModule allow send messages to passed to register static method queue
 * @param queueList: string[]  the string array of queues
 * @returns DynamicModule
 */
@Module({})
export class RabbitProducerModule {
  static register(queueList: string[]): DynamicModule {
    return {
      module: RabbitProducerModule,
      imports: [ConfigModule.forRoot()],
      providers: [
        ProducerService,
        {
          provide: RMQ_PRODUCER_QUEUE_LIST,
          useValue: queueList,
        },
      ],
      exports: [ProducerService],
    };
  }
}

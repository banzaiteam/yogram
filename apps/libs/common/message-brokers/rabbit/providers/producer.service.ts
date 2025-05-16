import amqp, { Channel, ChannelWrapper } from 'amqp-connection-manager';
import { IEvent } from '../../interfaces/event.interface';
import { RpcException } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { RMQ_PRODUCER_QUEUE_LIST } from '../rabbit-producer.module';
import { ConfigService } from '@nestjs/config';

export class ProducerService {
  private channelWrapper: ChannelWrapper;

  constructor(
    @Inject(RMQ_PRODUCER_QUEUE_LIST) private queueList: string[],
    private configService: ConfigService,
  ) {
    if (!this.queueList) {
      throw new RpcException(
        'you passed empty queue array to RabbitMQ ProducerService',
      );
    }
    queueList.forEach((element) => {
      if (element.length < 1) {
        throw new RpcException(
          'you passed empty queue to RabbitMQ ProducerService',
        );
      }
    });
    this.connect();
  }

  public async emit(event: IEvent, exchange: string = 'exchange1') {
    const content = event;
    return await this.channelWrapper.publish(
      exchange,
      event.routingKey,
      content,
    );
  }

  async connect() {
    const url = `amqps://tuldekzv:mpaT6WctNeBfqI8NZQ1cIAh4kOjk3K4B@kebnekaise.lmq.cloudamqp.com/tuldekzv`;
    const RMQ_URL = this.configService.get('RMQ_URL');
    // todo RMQ_URL does not work when pass to connect but we get it from configService
    const connection = amqp.connect(url);
    await connection.connect();
    connection.on('connect', () => console.log('rabbit provider Connected!'));
    connection.on('disconnect', (err) =>
      console.log('rabbit provider Disconnected.', err),
    );
    connection.on('connectFailed', (err) =>
      console.log('Connect Failed!', err),
    );

    this.channelWrapper = connection.createChannel({
      setup: async (channel: Channel) => {
        this.queueList.forEach(async (queue) => {
          return await channel.assertQueue(queue, { durable: true });
        });
      },
      json: true,
    });
  }
}

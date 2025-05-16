import {
  DynamicModule,
  Inject,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import {
  ChannelWrapper,
  connect,
  ConnectionUrl,
} from 'amqp-connection-manager';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import { ConfirmChannel } from 'amqplib';
import { ConfigService } from '@nestjs/config';
import { IQueueBindings } from '../interfaces/queue-bindings.interface';
import { RpcException } from '@nestjs/microservices';

const QUEUE_BINDINGS_LIST = 'QUEUE_BINDINGS_LIST';

/**
 * RabbitConsumerModule allow consume messages from passed queueBindingsList array
 * It realize topic hardcoded exchange with exchange1 name
 * @param queueBindingsList: IQueueBindings[]  the string array of queues and bindingKeys in format [{ queueName:['bindingKey'] }, {}, ...].
 * example: [{users:['users.verify.*']}, {posts:['posts.verify.#']}]
 * @returns DynamicModule
 */
@Module({
  imports: [],
})
export class RabbitConsumerModule implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(RabbitConsumerModule.name);
  private readonly actionMapper = new Object();

  static register(queueBindingsList: IQueueBindings[]): DynamicModule {
    return {
      module: RabbitConsumerModule,
      imports: [DiscoveryModule],
      providers: [
        {
          provide: QUEUE_BINDINGS_LIST,
          useValue: queueBindingsList,
        },
      ],
      exports: [RabbitConsumerModule, DiscoveryModule],
    };
  }

  // Connect to RabbitMQ on Constructor call and handle connection
  constructor(
    private readonly discover: DiscoveryService,
    @Inject(QUEUE_BINDINGS_LIST)
    private readonly queueBindingsList: IQueueBindings[],
    private readonly configService: ConfigService,
  ) {
    const url: ConnectionUrl = this.configService.get<string>('RMQ_URL');
    console.log('RMQ_URL', url);
    if (!queueBindingsList.length) {
      throw new RpcException('RabbitConsumerModule queueBindingsList is empty');
    }
    // todo RMQ_URL does not work when pass to connect but we get it from configService
    const connection = connect(
      `amqps://tuldekzv:mpaT6WctNeBfqI8NZQ1cIAh4kOjk3K4B@kebnekaise.lmq.cloudamqp.com/tuldekzv`,
    );
    connection.on('connect', () =>
      this.logger.log(
        `Inventory Service: Connected to ${this.queueBindingsList[0]}`,
      ),
    );
    connection.on('connectFailed', () =>
      this.logger.log(
        `Inventory Service: Failed to connect to ${this.queueBindingsList.toString()}`,
      ),
    );

    this.channelWrapper = connection.createChannel({});
  }

  // Scan project and map methods (consumers) using our decorator
  public async onModuleInit() {
    const providers = await this.getProviders();
    providers.forEach((element) => {
      this.actionMapper[element.meta.routingKey] = {
        class: element.discoveredMethod.parentClass.instance,
        method: element.discoveredMethod.handler,
      };
      this.logger.log(
        `Subscriber Assingnment: ${element.meta.routingKey} -> ${element.discoveredMethod.parentClass.name}::${element.discoveredMethod.methodName}`,
      );
    });

    this.setConsumers();
  }

  // Scan methods within classes using decorators with this meta: AMQP_SUBSCRIBER
  async getProviders() {
    return await this.discover.controllerMethodsWithMetaAtKey<any>(
      'AMQP_SUBSCRIBER',
    );
  }

  // Attach callbacks to Rabbit MQ Routing Keys (events names)
  async setConsumers() {
    try {
      this.queueBindingsList.forEach(async (item) => {
        await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
          const queueName = Object.keys(item)[0];
          const bindingKeys = item[queueName];
          await channel.assertQueue(queueName, {
            durable: true,
          });
          await channel.assertExchange('exchange1', 'topic');
          bindingKeys.forEach((key) => {
            console.log(
              `RabbitModule bindingKeys to queue: ${queueName}, key: ${key}`,
            );
            channel.bindQueue(queueName, 'exchange1', key);
          });
          channel.consume(queueName, async (message) => {
            // Bind Meesges here;
            console.log('Consuming from queue:', queueName);
            console.log('Received message:', message.content.toString());

            if (message) {
              const JsondMessage = JSON.parse(message.content.toString());
              console.log(JsondMessage, 'Parsed Message');

              const rtk = message.fields.routingKey;
              if (message.fields.routingKey in this.actionMapper) {
                const classy =
                  this.actionMapper[message.fields.routingKey].class;
                const method =
                  this.actionMapper[message.fields.routingKey].method;
                method.call(classy, rtk, JsondMessage);
              }
              channel.ack(message);
            }
          });
        });
      });
    } catch (error) {
      this.logger.error('Failed to start listeners.', error);
    }
  }
}

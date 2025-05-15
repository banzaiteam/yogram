import {
  DynamicModule,
  Inject,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import amqp, {
  ChannelWrapper,
  connect,
  ConnectionUrl,
} from 'amqp-connection-manager';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import { ConfirmChannel } from 'amqplib';
import { ConfigService } from '@nestjs/config';

export enum BindingKeysEnum {
  Users_Verify_One = 'users.verify.*',
  Users_Verify_Many = 'users.verify.#',
}
type BindingKeys = BindingKeysEnum[];
export interface IQueueBindings {
  [queue: string]: BindingKeys;
}

const blalba: IQueueBindings[] = [
  { users: [BindingKeysEnum.Users_Verify_One] },
];

@Module({
  imports: [DiscoveryModule],
})
export class RabbitModule implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(RabbitModule.name);
  private readonly actionMapper = new Object();

  static register(queueBindingsList: IQueueBindings[]): DynamicModule {
    return {
      module: RabbitModule,
      providers: [
        {
          provide: 'QUEUE_BINDINGS',
          useValue: queueBindingsList,
        },
      ],
      exports: [RabbitModule],
    };
  }

  // Connect to RabbitMQ on Constructor call and handle connection
  constructor(
    private readonly discover: DiscoveryService,
    @Inject('QUEUE_BINDINGS')
    private readonly queueBindingsList: IQueueBindings[],
    private readonly configService: ConfigService,
  ) {
    const url: ConnectionUrl = this.configService.get<string>('RMQ_URL');
    console.log('RMQ_URL', url);

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
    // console.log(providers);
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
    return await this.discover.providerMethodsWithMetaAtKey<any>(
      'AMQP_SUBSCRIBER',
    );
  }

  // Attach callbacks to Rabbit MQ Routing Keys (events names)
  async setConsumers() {
    try {
      this.queueBindingsList.forEach(async (item, index) => {
        await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
          const queueName = Object.keys(item)[0];
          const bindingKeys = item[queueName];
          console.log(
            '🚀 ~ QueueModule ~ awaitthis.channelWrapper.addSetup ~ bindingKeys:',
            bindingKeys,
          );
          await channel.assertQueue(queueName, {
            durable: true,
          });
          await channel.assertExchange('exchange1', 'topic');
          bindingKeys.forEach((key) => {
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

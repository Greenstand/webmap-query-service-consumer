import { BrokerConfig } from 'rascal'

export enum SubscriptionNames {
  CAPTURE_FEATURE = 'capture-created',
  RAW_CAPTURE_CREATED = 'raw-capture-created',
  TOKEN_ASSIGNED = 'token-assigned',
}

const brokerConfig: BrokerConfig = {
  vhosts: {
    v1: {
      connection: {
        url: process.env.RABBITMQ_URL,
        socketOptions: {
          timeout: 3000,
        },
      },
      exchanges: ['capture-data-ex', 'field-data', 'wallet-service-ex'],
      queues: [
        'capture-data:events',
        'field-data-events',
        'token-transfer:events',
      ],
      bindings: [
        'wallet-service-ex[token.transfer] -> token-transfer:events',
        'capture-data-ex -> capture-data:events',
        'field-data -> field-data-events',
      ],
      publications: {
        [SubscriptionNames.TOKEN_ASSIGNED]: {
          exchange: 'wallet-service-ex',
          routingKey: 'token.transfer',
        },
        [SubscriptionNames.RAW_CAPTURE_CREATED]: {
          exchange: 'field-data',
        },
        [SubscriptionNames.CAPTURE_FEATURE]: {
          exchange: 'capture-data-ex',
        },
      },
      subscriptions: {
        [SubscriptionNames.CAPTURE_FEATURE]: {
          queue: 'capture-data:events',
          contentType: 'application/json',
        },
        [SubscriptionNames.RAW_CAPTURE_CREATED]: {
          queue: 'field-data-events',
          contentType: 'application/json',
        },
        [SubscriptionNames.TOKEN_ASSIGNED]: {
          queue: 'token-transfer:events',
        },
      },
    },
  },
}

export default brokerConfig

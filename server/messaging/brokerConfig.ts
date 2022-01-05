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
      exchanges: ['amq.direct'],
      queues: [
        'capture-created',
        'raw-capture-created',
        'token-transfer-created',
      ],
      // default bindings should be good
      // and consumer does not need to set up any publication resources
      subscriptions: {
        [SubscriptionNames.CAPTURE_FEATURE]: {
          queue: 'capture-data-created',
          contentType: 'application/json',
        },
        [SubscriptionNames.RAW_CAPTURE_CREATED]: {
          queue: 'raw-capture-created',
          contentType: 'application/json',
        },
        [SubscriptionNames.TOKEN_ASSIGNED]: {
          queue: 'token-transfer-created',
        },
      },
    },
  },
}

export default brokerConfig

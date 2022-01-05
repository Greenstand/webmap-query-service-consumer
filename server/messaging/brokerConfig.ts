import { BrokerConfig } from 'rascal'

export enum SubscriptionNames {
  CAPTURE_FEATURE = 'capture-created',
  RAW_CAPTURE_CREATED = 'raw-capture-created',
  TOKEN_ASSIGNED = 'token-assigned',
}

const VHOST_NAME = 'v1'

const brokerConfig: BrokerConfig = {
  vhosts: {
    [VHOST_NAME]: {
      connection: {
        url: process.env.RABBITMQ_URL,
        socketOptions: {
          timeout: 3000,
        },
      },
      queues: [
        SubscriptionNames.CAPTURE_FEATURE,
        SubscriptionNames.RAW_CAPTURE_CREATED,
        SubscriptionNames.TOKEN_ASSIGNED,
      ],
      subscriptions: {
        [SubscriptionNames.CAPTURE_FEATURE]: {
          queue: SubscriptionNames.CAPTURE_FEATURE,
          contentType: 'application/json',
        },
        [SubscriptionNames.RAW_CAPTURE_CREATED]: {
          queue: SubscriptionNames.RAW_CAPTURE_CREATED,
          contentType: 'application/json',
        },
        [SubscriptionNames.TOKEN_ASSIGNED]: {
          queue: SubscriptionNames.TOKEN_ASSIGNED,
        },
      },
    },
  },
}

// configure publications for testing
if (process.env.NODE_ENV === 'test')
  brokerConfig.publications = {
    [SubscriptionNames.CAPTURE_FEATURE]: {
      vhost: VHOST_NAME,
      queue: SubscriptionNames.CAPTURE_FEATURE,
    },
    [SubscriptionNames.RAW_CAPTURE_CREATED]: {
      vhost: VHOST_NAME,
      queue: SubscriptionNames.RAW_CAPTURE_CREATED,
    },
    [SubscriptionNames.TOKEN_ASSIGNED]: {
      vhost: VHOST_NAME,
      queue: SubscriptionNames.TOKEN_ASSIGNED,
    },
  }

export default brokerConfig

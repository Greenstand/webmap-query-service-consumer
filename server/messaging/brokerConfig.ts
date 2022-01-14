import { BrokerConfig } from 'rascal'

export const enum SubscriptionNames {
  CAPTURE_CREATED = 'capture-created',
  RAW_CAPTURE_CREATED = 'raw-capture-created',
  TOKEN_ASSIGNED = 'token-assigned',
  MAP_NAME_ASSIGNED = 'map-name-assigned',
}

export const VHOST_NAME = 'v1'

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
        SubscriptionNames.CAPTURE_CREATED,
        SubscriptionNames.RAW_CAPTURE_CREATED,
        SubscriptionNames.TOKEN_ASSIGNED,
        SubscriptionNames.MAP_NAME_ASSIGNED,
      ],
      subscriptions: {
        [SubscriptionNames.CAPTURE_CREATED]: {
          queue: SubscriptionNames.CAPTURE_CREATED,
          contentType: 'application/json',
        },
        [SubscriptionNames.RAW_CAPTURE_CREATED]: {
          queue: SubscriptionNames.RAW_CAPTURE_CREATED,
          contentType: 'application/json',
        },
        [SubscriptionNames.TOKEN_ASSIGNED]: {
          queue: SubscriptionNames.TOKEN_ASSIGNED,
        },
        [SubscriptionNames.MAP_NAME_ASSIGNED]: {
          queue: SubscriptionNames.MAP_NAME_ASSIGNED,
        },
      },
    },
  },
}

export default brokerConfig

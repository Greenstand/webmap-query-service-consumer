const config = {
  vhosts: {
    v1: {
      connection: {
        url: process.env.RABBIT_MQ_URL,
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
        'token-assigned': {
          exchange: 'wallet-service-ex',
          routingKey: 'token.transfer',
        },
      },
      subscriptions: {
        'capture-created': {
          queue: 'capture-data:events',
          contentType: 'application/json',
        },
        'raw-capture-created': {
          queue: 'field-data-events',
          contentType: 'application/json',
        },
        'token-assigned': {
          queue: 'token-transfer:events',
        },
      },
    },
  },
}

export default config

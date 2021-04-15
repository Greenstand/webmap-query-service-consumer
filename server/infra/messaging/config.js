module.exports = {
    config: {
      vhosts: {
        v1: {
          connection: {
            url: process.env.RABBIT_MQ_URL,
            socketOptions: {
              timeout: 3000,
            },
          },
          exchanges: ['capture-data'],
          queues: ['capture-data:events'],
          subscriptions: {
            'capture-created': {
                "queue": "capture-data:events"
            },
          },
        },
      },
    },
  };
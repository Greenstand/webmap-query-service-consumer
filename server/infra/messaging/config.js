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
          exchanges: ['capture-data-ex'],
          queues: ['capture-data:events'],
          bindings: [
            "capture-data-ex -> capture-data:events"
          ],
          subscriptions: {
            'capture-created': {
                "queue": "capture-data:events",
                "contentType": "application/json"
            },
          },
        },
      },
    },
  };
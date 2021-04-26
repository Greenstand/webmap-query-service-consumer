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
          exchanges: ['capture-data-ex', 'field-data'],
          queues: ['capture-data:events', 'field-data-events'],
          bindings: [
            "capture-data-ex -> capture-data:events",
            "field-data -> field-data-events"
          ],
          subscriptions: {
            'capture-created': {
                "queue": "capture-data:events",
                "contentType": "application/json"
            },
            'raw-capture-created': {
               "queue": "field-data-events",
               "contentType": "application/json"
            }
          },
        },
      },
    },
  };
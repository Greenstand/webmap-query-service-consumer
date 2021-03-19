const { subscribe } = require('../infra/messaging/RabbitMQMessaging');

const exampleHandler = (async (message) => {
  // logic for the event that is being handled
});

const registerEventHandlers = () => {
    subscribe("queue-event-name", exampleHandler);
}

module.exports = registerEventHandlers;


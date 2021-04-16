const Broker = require('rascal').BrokerAsPromised
const config = require('./config').config

const publish = (async (publicationName, routingKey, payload, resultHandler) => {
    const broker = await Broker.create(config);
    try {
        const publication = await broker.publish(publicationName, payload, routingKey);
        publication
        .on("success", resultHandler)
        .on("error", (err, messageId)=> {
            console.error(`Error with id ${messageId} ${err.message}`);
            throw err;
        });
    } catch(err) {
        console.error(`Error publishing message ${err}`);
    }
});

const subscribe = (async (subscriptionName, eventHandler) => {
    const broker = await Broker.create(config);
    try {
        const subscription = await broker.subscribe(subscriptionName);
        subscription
        .on('message',(message, content, ackOrNack) => {
            eventHandler(content);
            ackOrNack();
        })
        .on('error', console.error);
    } catch(err) {
        console.error(`Error subscribing to ${subscriptionName}, error: ${err}`);
    }
});

module.exports = { publish, subscribe };
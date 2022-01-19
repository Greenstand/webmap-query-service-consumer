import { BrokerAsPromised } from 'rascal'
import { Global } from 'interfaces/Global'
import brokerConfig, { SubscriptionNames } from './brokerConfig'

async function createBroker(config = brokerConfig) {
  console.info('creating broker')
  const broker = await BrokerAsPromised.create(config)
  ;(global as Global).broker = broker
  return broker
}

export function getBroker() {
  return (global as Global).broker ?? createBroker()
}

export async function subscribe<T>(
  subscriptionName: SubscriptionNames,
  eventHandler: (content: T) => Promise<void>,
) {
  try {
    const broker = await getBroker()
    const subscription = await broker.subscribe(subscriptionName)
    subscription
      .on('message', async (_message, content: T, ackOrNack) => {
        try {
          await eventHandler(content)
          ackOrNack()
        } catch (err) {
          console.error(err)
          ackOrNack(err as Error, [
            // republish until attempts limit then dead-letter
            {
              strategy: 'republish',
              defer: 10000,
              attempts: 10,
            },
            {
              strategy: 'nack',
            },
          ])
        }
      })
      .on('error', console.error)
  } catch (err) {
    console.error(`Error subscribing to ${subscriptionName}, error: ${err}`)
  }
}

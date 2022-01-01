import { Global } from 'interfaces/global'
import { BrokerAsPromised } from 'rascal'
import brokerConfig, { SubscriptionNames } from './brokerConfig'

async function createBroker(config = brokerConfig) {
  console.log('creating broker')
  const broker = await BrokerAsPromised.create(config)
  ;(global as Global).broker = broker
  return broker
}
export function getBroker() {
  return (global as Global).broker ?? createBroker()
}

export async function publish<T>(
  publicationName: SubscriptionNames,
  routingKey: string,
  payload: T,
  resultHandler: (messageId: string) => void,
) {
  try {
    const broker = await getBroker()
    const publication = await broker.publish(
      publicationName,
      payload,
      routingKey,
    )
    publication.on('success', resultHandler).on('error', (err, messageId) => {
      console.error(`Error with id ${messageId} ${err.message}`)
      throw err
    })
  } catch (err) {
    console.error(`Error publishing message ${err}`, err)
  }
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
              defer: 1000,
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

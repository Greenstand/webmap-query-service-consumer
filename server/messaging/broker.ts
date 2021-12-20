import log from 'loglevel'
import { BrokerAsPromised as Broker } from 'rascal'

import brokerConfig from './brokerConfig'

type Global = { __BROKER?: Broker }

export type TokenMessage = {
  entries: {
    capture_id: string
  }[]
  wallet_name: string
}

export type EventName =
  | 'capture-created'
  | 'raw-capture-created'
  | 'token-assigned'

export async function createBroker(config = brokerConfig) {
  console.log('creating broker...')
  const broker = await Broker.create(config)
  ;(global as Global).__BROKER = broker
  return broker
}

export async function getBroker() {
  return (global as Global).__BROKER ?? (await createBroker())
}

export async function publish<T>(
  publicationName: string,
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
      log.error(`Error with id ${messageId} ${err.message}`)
      throw err
    })
  } catch (err) {
    log.error(`Error publishing message ${err}`, err)
  }
}

export async function subscribe<T>(
  subscriptionName: string,
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
          log.error(err)
          ackOrNack(new Error(err as string))
        }
      })
      .on('error', log.error)
  } catch (err) {
    log.error(`Error subscribing to ${subscriptionName}, error: ${err}`)
  }
}

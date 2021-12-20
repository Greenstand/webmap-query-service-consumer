import log from 'loglevel'
import { BrokerAsPromised as Broker } from 'rascal'

import brokerConfig from './brokerConfig'

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

export function initBroker(config = brokerConfig) {
  return Broker.create(config)
}

export async function publish<T>(
  broker: Broker,
  publicationName: string,
  routingKey: string,
  payload: T,
  resultHandler: (messageId: string) => void,
) {
  try {
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
  broker: Broker,
  subscriptionName: string,
  eventHandler: (content: T) => Promise<void>,
) {
  try {
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

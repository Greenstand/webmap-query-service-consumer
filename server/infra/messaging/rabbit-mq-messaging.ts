import log from 'loglevel'
import { BrokerAsPromised as Broker } from 'rascal'

import config from './config'

export function initBroker() {
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
  eventHandler: (content: T) => void,
) {
  try {
    const subscription = await broker.subscribe(subscriptionName)
    subscription
      .on('message', (_message, content: T, ackOrNack) => {
        eventHandler(content)
        ackOrNack()
      })
      .on('error', log.error)
  } catch (err) {
    log.error(`Error subscribing to ${subscriptionName}, error: ${err}`)
  }
}

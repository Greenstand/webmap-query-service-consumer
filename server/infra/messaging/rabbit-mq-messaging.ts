import log from 'loglevel'
import rascal from 'rascal'

import config from './config'

const Broker = rascal.BrokerAsPromised

export async function publish<T1>(
  publicationName: string,
  routingKey: string,
  payload: T1,
  resultHandler: (messageId: string) => void,
) {
  try {
    const broker = await Broker.create(config)
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
  subscriptionName: string,
  eventHandler: (event: T) => void,
) {
  const broker = await Broker.create(config)
  try {
    const subscription = await broker.subscribe(subscriptionName)
    subscription
      .on('message', (_message, content: T, ackOrNack) => {
        eventHandler(content)
        ackOrNack()
      })
      .on('error', console.error)
  } catch (err) {
    console.error(`Error subscribing to ${subscriptionName}, error: ${err}`)
  }
}

export const unsubscribeAll = async () => {
  log.warn('unsubscribeAll')
  try {
    const broker = await Broker.create(config)
    await broker.unsubscribeAll()
  } catch (err) {
    console.error(`Error unsubscribeAll , error: ${err}`)
  }
}

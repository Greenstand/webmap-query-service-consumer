import brokerConfig, {
  SubscriptionNames,
  VHOST_NAME,
} from 'messaging/brokerConfig'
import { BrokerAsPromised } from 'rascal'
import { TestGlobal } from './TestGlobal'

const _global = global as TestGlobal

export async function handleBrokers(
  cb: (b: BrokerAsPromised) => Promise<void>,
) {
  // get active brokers
  const brokers: BrokerAsPromised[] = [
    _global.broker,
    _global.publisher,
  ].filter(Boolean) as BrokerAsPromised[]

  return Promise.all(brokers.map(cb))
}

async function createPublisher() {
  const publisher = await BrokerAsPromised.create({
    ...brokerConfig,
    publications: {
      [SubscriptionNames.CAPTURE_CREATED]: {
        vhost: VHOST_NAME,
        queue: SubscriptionNames.CAPTURE_CREATED,
      },

      [SubscriptionNames.TOKEN_ASSIGNED]: {
        vhost: VHOST_NAME,
        queue: SubscriptionNames.TOKEN_ASSIGNED,
      },

      [SubscriptionNames.RAW_CAPTURE_CREATED]: {
        vhost: VHOST_NAME,
        queue: SubscriptionNames.RAW_CAPTURE_CREATED,
      },

      [SubscriptionNames.MAP_NAME_ASSIGNED]: {
        vhost: VHOST_NAME,
        queue: SubscriptionNames.MAP_NAME_ASSIGNED,
      },
    },
  })

  _global.publisher = publisher
  return publisher
}

function getPublisher() {
  return _global.publisher ?? createPublisher()
}

export async function publishMessage<T>(
  publicationName: SubscriptionNames,
  message: T,
  routingKey: string = '',
  resultHandler: (messageId: string) => void = () => {},
) {
  try {
    const publisher = await getPublisher()
    const publication = await publisher.publish(
      publicationName,
      message,
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

import { BrokerAsPromised } from 'rascal'
import brokerConfig, {
  SubscriptionNames,
  VHOST_NAME,
} from 'messaging/brokerConfig'
import { TestGlobal } from './TestGlobal'

const testGlobal = global as TestGlobal

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
  testGlobal.publisher = publisher
  return publisher
}

function getPublisher() {
  return testGlobal.publisher ?? createPublisher()
}

export async function destroyPublisher() {
  const { publisher } = testGlobal
  if (!publisher) return
  await publisher.unsubscribeAll()
  await publisher.purge()
  await publisher.shutdown()
}

export async function publishMessage<T>(
  publicationName: SubscriptionNames,
  message: T,
  routingKey = '',
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

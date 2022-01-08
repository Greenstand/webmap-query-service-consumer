import knex, { TableNames } from 'db/knex'
import { Global } from 'interfaces/global'
import brokerConfig, {
  SubscriptionNames,
  VHOST_NAME,
} from 'messaging/brokerConfig'
import { BrokerAsPromised } from 'rascal'

const _global = global as Global & { publisher?: BrokerAsPromised }

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
  console.log('creating publisher')

  const publisher = await BrokerAsPromised.create({
    ...brokerConfig,
    publications: {
      [SubscriptionNames.CAPTURE_FEATURE]: {
        vhost: VHOST_NAME,
        queue: SubscriptionNames.CAPTURE_FEATURE,
      },

      [SubscriptionNames.TOKEN_ASSIGNED]: {
        vhost: VHOST_NAME,
        queue: SubscriptionNames.TOKEN_ASSIGNED,
      },

      [SubscriptionNames.RAW_CAPTURE_CREATED]: {
        vhost: VHOST_NAME,
        queue: SubscriptionNames.RAW_CAPTURE_CREATED,
      },
    },
  })

  _global.publisher = publisher
  return publisher
}

export function getPublisher() {
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

export function truncateTables(tables: TableNames[]) {
  return Promise.all(
    tables.map((table) => knex.raw(`truncate table ${table} cascade`)),
  )
}

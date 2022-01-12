import knex, { TableNames } from 'db/knex'
import CaptureFeature from 'interfaces/CaptureFeature'
import { Global } from 'interfaces/Global'
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

export function truncateTables(tables: TableNames[]) {
  return Promise.all(
    tables.map((table) => knex.raw(`truncate table ${table} cascade`)),
  )
}

export async function prepareRegionData(
  table: TableNames,
  { lat, lon }: Pick<CaptureFeature, 'lat' | 'lon'>,
) {
  const cluster_zoom_level = 14
  // prepare two clusters, the new capture will find the nearest to update
  await knex(table).insert({
    zoom_level: cluster_zoom_level,
    location: `POINT(${lon + 1} ${lat})`,
    count: 1,
  })
  // a farther cluster
  await knex(table).insert({
    zoom_level: cluster_zoom_level,
    location: `POINT(${lon + 2} ${lat})`,
    count: 5,
  })
}

export async function dataExists(id: string): Promise<boolean> {
  const result = await knex(TableNames.REGION_ASSIGNMENT).select().where({
    map_feature_id: id,
    zoom_level: 9,
    region_id: 2281072,
  })
  return result?.length === 1
}

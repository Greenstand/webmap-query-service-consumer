import { BrokerAsPromised } from 'rascal'
import knex, { TableNames } from 'db/knex'
import CaptureFeature from 'interfaces/CaptureFeature'
import TestGlobal from './TestGlobal'

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

export async function handleBrokers(
  cb: (broker: BrokerAsPromised) => Promise<void>,
) {
  // get active brokers
  const testGlobal = global as TestGlobal
  const brokers: BrokerAsPromised[] = [
    testGlobal.broker,
    testGlobal.publisher,
  ].filter(Boolean) as BrokerAsPromised[]
  return Promise.all(brokers.map(cb))
}

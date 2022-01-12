import { BrokerAsPromised } from 'rascal'
import waitForExpect from 'wait-for-expect'
import knex, { TableNames } from 'db/knex'
import CaptureFeature from 'interfaces/CaptureFeature'
import { TestGlobal } from './TestGlobal'

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

export async function testForRegionData(
  id: string,
  clusterTable: TableNames.CAPTURE_CLUSTER | TableNames.RAW_CAPTURE_CLUSTER,
) {
  await waitForExpect(async () => {
    const result = await knex(TableNames.REGION_ASSIGNMENT).select().where({
      map_feature_id: id,
      zoom_level: 9,
      region_id: 2281072,
    })
    expect(result).toHaveLength(1)
  })
  await waitForExpect(async () => {
    const result = await knex(TableNames.REGION_ASSIGNMENT).select().where({
      map_feature_id: id,
    })
    expect(result).toHaveLength(15)
  })
  await waitForExpect(async () => {
    const result = await knex(clusterTable).select().where({
      count: 2,
    })
    expect(result).toHaveLength(1)
  })
}

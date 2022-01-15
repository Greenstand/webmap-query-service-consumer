import knex, { TableNames } from 'db/knex'
import CaptureFeature from 'interfaces/CaptureFeature'

export async function expectClusterHasRegionData(
  clusterTable: TableNames.CAPTURE_CLUSTER | TableNames.RAW_CAPTURE_CLUSTER,
  id: string,
) {
  let result = await knex(TableNames.REGION_ASSIGNMENT).select().where({
    map_feature_id: id,
    zoom_level: 9,
    region_id: 2281072,
  })
  expect(result).toHaveLength(1)
  result = await knex(TableNames.REGION_ASSIGNMENT).select().where({
    map_feature_id: id,
  })
  expect(result).toHaveLength(15)
  result = await knex(clusterTable).select().where({
    count: 2,
  })
  expect(result).toHaveLength(1)
}

export async function expectFeatureToHaveMap(
  table: TableNames,
  id: string,
  mapName: string,
) {
  const result: CaptureFeature[] = await knex(table).select().where('id', id)
  expect(result).toHaveLength(1)
  const { map_name: map } = result[0] as CaptureFeature
  expect(map?.map).toEqual(mapName)
}

export async function expectTableHasId(table: TableNames, id: string) {
  const result = await knex(table).select().where('id', id)
  expect(result).toHaveLength(1)
}

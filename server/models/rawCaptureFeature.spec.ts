import data from '@mock/capture_in_kenya.json'
import knex, { TableNames } from 'db/knex'
import {
  expectTableHasId,
  expectClusterHasRegionData,
} from '@test/featureAssertions'
import { prepareRegionData, truncateTables } from '@test/utils'
import {
  addRawCapture,
  assignRawCaptureRegion,
  updateRawCaptureCluster,
} from './rawCaptureFeature'

const tables = [
  TableNames.RAW_CAPTURE_FEATURE, //
  TableNames.REGION_ASSIGNMENT,
  TableNames.RAW_CAPTURE_CLUSTER,
]

beforeAll(async () => {
  await truncateTables(tables)
  await addRawCapture(data)
})

it('should add the object to the db', async () => {
  await expectTableHasId(TableNames.RAW_CAPTURE_FEATURE, data.id)
})

it('should assign region', async () => {
  await assignRawCaptureRegion(data)
  const assignRegionResult = await knex(TableNames.REGION_ASSIGNMENT)
    .select()
    .where({
      map_feature_id: data.id,
      zoom_level: 9,
      region_id: 2281072,
    })
  expect(assignRegionResult).toHaveLength(1)
})

it('should update cluster', async () => {
  await prepareRegionData(TableNames.RAW_CAPTURE_CLUSTER, data)
  await updateRawCaptureCluster(data)
  const { id } = data
  await expectClusterHasRegionData(TableNames.RAW_CAPTURE_CLUSTER, id)
})

import knex, { TableNames } from 'db/knex'
import {
  addCaptureFeature,
  assignCaptureFeatureRegion,
  updateCaptureCluster,
} from 'models/captureFeature'
import data from '@test/mock/capture_in_kenya.json'
import {
  expectClusterHasRegionData,
  expectTableHasId,
  prepareRegionData,
  truncateTables,
} from '@test/utils'

beforeAll(async () => {
  await truncateTables([
    TableNames.CAPTURE_FEATURE,
    TableNames.REGION_ASSIGNMENT,
    TableNames.CAPTURE_CLUSTER,
  ])
  await addCaptureFeature(data)
})

it('should add the capture to the db', async () => {
  await expectTableHasId(TableNames.CAPTURE_FEATURE, data.id)
})

it('should assign region', async () => {
  await assignCaptureFeatureRegion(data)
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
  await prepareRegionData(TableNames.CAPTURE_CLUSTER, data)
  await updateCaptureCluster(data)
  const { id } = data
  await expectClusterHasRegionData(TableNames.CAPTURE_CLUSTER, id)
})

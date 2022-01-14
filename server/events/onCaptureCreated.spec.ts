import { TableNames } from 'db/knex'
import data from '@test/mock/capture_in_kenya.json'
import {
  expectTableHasId,
  prepareRegionData,
  expectClusterHasRegionData,
  truncateTables,
} from '@test/utils'
import onCaptureCreated from './onCaptureCreated'

describe('capture created', () => {
  const { id } = data

  beforeAll(async () => {
    await truncateTables([
      TableNames.CAPTURE_FEATURE,
      TableNames.REGION_ASSIGNMENT,
      TableNames.CAPTURE_CLUSTER,
    ])
  })

  it('should successfully handle captureCreated event', async () => {
    await prepareRegionData(TableNames.CAPTURE_CLUSTER, data)
    await onCaptureCreated(data)
    await expectTableHasId(TableNames.CAPTURE_FEATURE, id)
    await expectClusterHasRegionData(TableNames.CAPTURE_CLUSTER, id)
  })
})

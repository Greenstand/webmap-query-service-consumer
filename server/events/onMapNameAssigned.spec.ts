import waitForExpect from 'wait-for-expect'
import knex, { TableNames } from 'db/knex'
import { addRawCapture } from 'models/rawCaptureFeature'
import mockCapture from '@test/mock/capture.json'
import stakeholder from '@test/mock/stakeholder.json'
import { expectFeatureToHaveMap, truncateTables } from '@test/utils'
import onMapNameAssigned, { MapNameAssigned } from './onMapNameAssigned'

beforeEach(async () => {
  await truncateTables([
    TableNames.CAPTURE_FEATURE, //
    TableNames.RAW_CAPTURE_FEATURE,
  ])
})

const message: MapNameAssigned = {
  type: 'ImpactProducerAssigned',
  impact_producer_id: '1',
  map_feature_ids: [
    mockCapture.id, //
  ],
  map_feature_kind: 'capture',
}

it('should handle event and assign map name to capture feature', async () => {
  await knex(TableNames.CAPTURE_FEATURE).insert(mockCapture)
  await onMapNameAssigned(message)
  await waitForExpect(async () => {
    await expectFeatureToHaveMap(
      TableNames.CAPTURE_FEATURE,
      mockCapture.id,
      stakeholder.map,
    )
  })
})

it('should handle event and assign map name for raw captures', async () => {
  await addRawCapture(mockCapture)
  await onMapNameAssigned({
    ...message,
    map_feature_kind: 'raw_capture',
  } as MapNameAssigned)
  await expectFeatureToHaveMap(
    TableNames.RAW_CAPTURE_FEATURE,
    mockCapture.id,
    stakeholder.map,
  )
})

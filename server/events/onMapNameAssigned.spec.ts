import waitForExpect from 'wait-for-expect'
import knex, { TableNames } from 'db/knex'
import CaptureFeature from 'interfaces/CaptureFeature'
import { SubscriptionNames } from 'messaging/brokerConfig'
import registerEventHandlers from 'messaging/registerEventHandlers'
import { addRawCapture } from 'models/rawCaptureFeature'
import mockCapture from '@test/mock/capture.json'
import { publishMessage } from '@test/publisher'
import { truncateTables } from '@test/utils'
import { MapNameAssigned } from './onMapNameAssigned'

beforeAll(async () => {
  await registerEventHandlers()
})

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
  await publishMessage(SubscriptionNames.MAP_NAME_ASSIGNED, message, '', (e) =>
    console.log('result:', e),
  )
  await waitForExpect(async () => {
    const result = await knex(TableNames.CAPTURE_FEATURE)
      .select()
      .where('id', mockCapture.id)
    expect(result).toHaveLength(1)
    const { map_name: map } = result[0] as CaptureFeature
    expect(map)
  })
})

it('should handle event and assign map name for raw captures', async () => {
  await addRawCapture(mockCapture)
  await publishMessage(SubscriptionNames.MAP_NAME_ASSIGNED, {
    ...message, //
    map_feature_kind: 'raw_capture',
  } as MapNameAssigned)
  await waitForExpect(async () => {
    const result = await knex(TableNames.RAW_CAPTURE_FEATURE)
      .select()
      .where('id', mockCapture.id)
    expect(result).toHaveLength(1)
    const { map_name: map } = result[0] as CaptureFeature
    expect(map)
  })
})

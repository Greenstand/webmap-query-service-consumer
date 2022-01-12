import waitForExpect from 'wait-for-expect'
import knex, { TableNames } from 'db/knex'
import CaptureFeature from 'interfaces/CaptureFeature'
import { SubscriptionNames } from 'messaging/brokerConfig'
import registerEventHandlers from 'messaging/registerEventHandlers'
import mockCapture from '@test/mock/capture.json'
import { publishMessage, truncateTables } from '@test/utils'

beforeAll(async () => {
  await registerEventHandlers()
})

beforeEach(async () => {
  await truncateTables([TableNames.CAPTURE_FEATURE])
})

it('should handle map name assigned event', async () => {
  // prepare the capture before the wallet event
  await knex(TableNames.CAPTURE_FEATURE).insert(mockCapture)

  const message = {
    type: 'ImpactProducerAssigned',
    impact_producer_id: '1',
    map_feature_ids: [
      mockCapture.id, //
    ],
    map_feature_kind: 'capture',
  }

  // publish the capture
  await publishMessage(SubscriptionNames.MAP_NAME_ASSIGNED, message, '', (e) =>
    console.log('result:', e),
  )

  await waitForExpect(async () => {
    // check if message was consumed and handled
    const result = await knex(TableNames.CAPTURE_FEATURE)
      .select()
      .where('id', mockCapture.id)
    expect(result).toHaveLength(1)
    const { map_name: map } = result[0] as CaptureFeature
    expect(map)
  })
})

import waitForExpect from 'wait-for-expect'
import knex, { TableNames } from 'db/knex'
import { MapNameAssigned } from 'events/onMapNameAssigned'
import { SubscriptionNames } from 'messaging/brokerConfig'
import mockCapture from '@test/mock/capture.json'
import stakeholder from '@test/mock/stakeholder.json'
import { publishMessage } from '@test/publisher'
import { expectFeatureToHaveMap, truncateTables } from '@test/utils'

const message: MapNameAssigned = {
  type: 'ImpactProducerAssigned',
  impact_producer_id: '1',
  map_feature_ids: [
    mockCapture.id, //
  ],
  map_feature_kind: 'capture',
}

beforeEach(async () => {
  await truncateTables([
    TableNames.CAPTURE_FEATURE, //
    TableNames.RAW_CAPTURE_FEATURE,
  ])
})

it(`should handle ${SubscriptionNames.MAP_NAME_ASSIGNED} event and assign map name to capture feature`, async () => {
  await knex(TableNames.CAPTURE_FEATURE).insert(mockCapture)
  await publishMessage(SubscriptionNames.MAP_NAME_ASSIGNED, message)

  await waitForExpect(async () => {
    await expectFeatureToHaveMap(
      TableNames.CAPTURE_FEATURE,
      mockCapture.id,
      stakeholder.map,
    )
  })
})

import { SetupServerApi } from 'msw/node'
import knex, { TableNames } from 'db/knex'
import { SubscriptionNames } from 'messaging/brokerConfig'
import { addRawCapture } from 'models/rawCaptureFeature'
import { expectFeatureToHaveMap } from '@test/featureAssertions'
import mockCapture from '@test/mock/capture.json'
import stakeholder from '@test/mock/stakeholder.json'
import { createStakeholderApi } from '@test/stakeholderApi'
import { truncateTables } from '@test/utils'
import onMapNameAssigned, { MapNameAssigned } from './onMapNameAssigned'

const message: MapNameAssigned = {
  type: 'ImpactProducerAssigned',
  impact_producer_id: '1',
  map_feature_ids: [
    mockCapture.id, //
  ],
  map_feature_kind: 'capture',
}

let mockServer: SetupServerApi

beforeAll(async () => {
  await truncateTables([
    TableNames.CAPTURE_FEATURE, //
    TableNames.RAW_CAPTURE_FEATURE,
  ])

  mockServer = createStakeholderApi()
  mockServer.listen()
})

afterAll(() => {
  mockServer.close()
})

describe(`should handle ${SubscriptionNames.MAP_NAME_ASSIGNED} event`, () => {
  it(`should assign map name to capture feature`, async () => {
    await knex(TableNames.CAPTURE_FEATURE).insert(mockCapture)
    await onMapNameAssigned(message)
    await expectFeatureToHaveMap(
      TableNames.CAPTURE_FEATURE,
      mockCapture.id,
      stakeholder.map,
    )
  })

  it('should assign map name to raw captures', async () => {
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
})

import { SetupServerApi } from 'msw/node'
import waitForExpect from 'wait-for-expect'
import knex, { TableNames } from 'db/knex'
import ImpactProducerAssigned from 'interfaces/messages/ImpactProducerAssigned'
import { SubscriptionNames } from 'messaging/brokerConfig'
import registerEventHandlers from 'messaging/registerEventHandlers'
import { addRawCapture } from 'models/rawCaptureFeature'
import createStakeholderApi from '@test/createStakeholderApi'
import { expectFeatureToHaveMap } from '@test/featureAssertions'
import mockCapture from '@test/mock/capture.json'
import stakeholder from '@test/mock/stakeholder.json'
import { publishMessage } from '@test/publisher'
import { truncateTables } from '@test/utils'

const message: ImpactProducerAssigned = {
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
  await registerEventHandlers()
})

afterAll(() => {
  mockServer.close()
})

describe(`should handle ${SubscriptionNames.IMPACT_PRODUCER_ASSIGNED} event`, () => {
  it(`should assign impact_producer to capture feature map object`, async () => {
    await knex(TableNames.CAPTURE_FEATURE).insert(mockCapture)
    await publishMessage(SubscriptionNames.IMPACT_PRODUCER_ASSIGNED, message)

    await waitForExpect(async () => {
      await expectFeatureToHaveMap(
        TableNames.CAPTURE_FEATURE, //
        mockCapture.id,
        stakeholder.map,
      )
    })
  })

  it('should assign map name to raw captures', async () => {
    await addRawCapture(mockCapture)
    await publishMessage(SubscriptionNames.IMPACT_PRODUCER_ASSIGNED, {
      ...message,
      map_feature_kind: 'raw_capture',
    })

    await waitForExpect(async () => {
      await expectFeatureToHaveMap(
        TableNames.RAW_CAPTURE_FEATURE,
        mockCapture.id,
        stakeholder.map,
      )
    })
  })
})

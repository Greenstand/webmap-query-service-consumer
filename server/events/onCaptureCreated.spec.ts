import waitForExpect from 'wait-for-expect'
import { TableNames } from 'db/knex'
import { SubscriptionNames } from 'messaging/brokerConfig'
import registerEventHandlers from 'messaging/registerEventHandlers'
import {
  expectTableHasId,
  expectClusterHasRegionData,
} from '@test/featureAssertions'
import data from '@test/mock/capture_in_kenya.json'
import { publishMessage } from '@test/publisher'
import { prepareRegionData, truncateTables } from '@test/utils'

const { id } = data

beforeAll(async () => {
  await truncateTables([
    TableNames.CAPTURE_FEATURE,
    TableNames.REGION_ASSIGNMENT,
    TableNames.CAPTURE_CLUSTER,
  ])
  await prepareRegionData(TableNames.CAPTURE_CLUSTER, data)
  await registerEventHandlers()
  await publishMessage(SubscriptionNames.CAPTURE_CREATED, data)
})

it('should successfully handle captureCreated event', async () => {
  await waitForExpect(async () => {
    await expectTableHasId(TableNames.CAPTURE_FEATURE, id)
  })
  await waitForExpect(async () => {
    await expectClusterHasRegionData(TableNames.CAPTURE_CLUSTER, id)
  })
})

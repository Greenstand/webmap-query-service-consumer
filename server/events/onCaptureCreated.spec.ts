import waitForExpect from 'wait-for-expect'
import knex, { TableNames } from 'db/knex'
import { SubscriptionNames } from 'messaging/brokerConfig'
import registerEventHandlers from 'messaging/registerEventHandlers'
import data from '@test/mock/capture_in_kenya.json'
import { publishMessage } from '@test/publisher'
import {
  prepareRegionData,
  testForRegionData,
  truncateTables,
} from '@test/utils'

describe('capture created', () => {
  const { id } = data

  beforeAll(async () => {
    await truncateTables([
      TableNames.CAPTURE_FEATURE,
      TableNames.RAW_CAPTURE_FEATURE,
      TableNames.REGION_ASSIGNMENT,
      TableNames.CAPTURE_CLUSTER,
    ])
    await prepareRegionData(TableNames.CAPTURE_CLUSTER, data)
    await registerEventHandlers()
    await publishMessage(SubscriptionNames.CAPTURE_CREATED, data)
  })

  it('should successfully handle captureCreated event', async () => {
    await waitForExpect(async () => {
      const result = await knex(TableNames.CAPTURE_FEATURE)
        .select()
        .where('id', id)
      expect(result).toHaveLength(1)
    })
    await testForRegionData(id, TableNames.CAPTURE_CLUSTER)
  })
})

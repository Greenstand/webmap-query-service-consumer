import data from '@test/mock/capture_in_kenya.json'
import { prepareRegionData, publishMessage, truncateTables } from '@test/utils'
import waitForExpect from 'wait-for-expect'
import knex, { TableNames } from 'db/knex'
import { SubscriptionNames } from 'messaging/brokerConfig'
import registerEventHandlers from 'messaging/eventHandlers'

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
    await publishMessage(SubscriptionNames.CAPTURE_FEATURE, data)
  })

  it('should successfully handle captureCreated event', async () => {
    await waitForExpect(async () => {
      const result = await knex(TableNames.CAPTURE_FEATURE)
        .select()
        .where('id', id)
      expect(result).toHaveLength(1)
    })
  })

  it('should assign region data', async () => {
    await waitForExpect(async () => {
      const result = await knex(TableNames.REGION_ASSIGNMENT).select().where({
        map_feature_id: id,
        zoom_level: 9,
        region_id: 2281072,
      })
      expect(result).toHaveLength(1)
    })

    await waitForExpect(async () => {
      const result = await knex(TableNames.REGION_ASSIGNMENT).select().where({
        map_feature_id: id,
      })
      expect(result).toHaveLength(15)
    })

    await waitForExpect(async () => {
      const result = await knex(TableNames.CAPTURE_CLUSTER).select().where({
        count: 2,
      })
      expect(result).toHaveLength(1)
    })
  })

  it.skip('Successfully reject captureCreated event', async () => {
    // prepare the capture before the wallet event
    await knex(TableNames.CAPTURE_FEATURE).insert(data)
    // publish the capture

    //    await publish(SubscriptionNames.CAPTURE_FEATURE, '', data, (e) =>
    //    console.log('result:', e),
    // )

    // wait for message to be consumed
    await new Promise((r) => setTimeout(() => r(''), 3000))
    // check if message was consumed and handled
    const result = await knex(TableNames.CAPTURE_FEATURE)
      .select()
      .where('id', data.id)
    expect(result).toHaveLength(1)
  })
})

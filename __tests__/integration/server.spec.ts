import waitForExpect from 'wait-for-expect'
import knex, { TableNames } from 'db/knex'
import MapNameMessage from 'interfaces/messages/MapNameAssigned'
import { SubscriptionNames } from 'messaging/brokerConfig'
import {
  expectFeatureToHaveMap,
  expectTableHasId,
  expectClusterHasRegionData,
} from '@test/featureAssertions'
import captureData from '@test/mock/capture.json'
import kenyaData from '@test/mock/capture_in_kenya.json'
import stakeholder from '@test/mock/stakeholder.json'
import { publishMessage } from '@test/publisher'
import { prepareRegionData, truncateTables } from '@test/utils'

beforeEach(async () => {
  await truncateTables([
    TableNames.CAPTURE_FEATURE, //
    TableNames.RAW_CAPTURE_FEATURE,
    TableNames.RAW_CAPTURE_CLUSTER,
    TableNames.REGION_ASSIGNMENT,
    TableNames.CAPTURE_CLUSTER,
  ])
})

it.skip(`should handle ${SubscriptionNames.MAP_NAME_ASSIGNED} event`, async () => {
  const message: MapNameMessage = {
    type: 'ImpactProducerAssigned',
    impact_producer_id: '1',
    map_feature_ids: [
      kenyaData.id, //
    ],
    map_feature_kind: 'capture',
  }

  await knex(TableNames.CAPTURE_FEATURE).insert(kenyaData)
  await publishMessage(SubscriptionNames.MAP_NAME_ASSIGNED, message)

  await waitForExpect(async () => {
    await expectFeatureToHaveMap(
      TableNames.CAPTURE_FEATURE,
      kenyaData.id,
      stakeholder.map,
    )
  })
})

it(`should handle ${SubscriptionNames.CAPTURE_CREATED} event`, async () => {
  await prepareRegionData(TableNames.CAPTURE_CLUSTER, kenyaData)
  await publishMessage(SubscriptionNames.CAPTURE_CREATED, kenyaData)
  const { id } = kenyaData
  await waitForExpect(async () => {
    await expectTableHasId(TableNames.CAPTURE_FEATURE, id)
  })
  await waitForExpect(async () => {
    await expectClusterHasRegionData(TableNames.CAPTURE_CLUSTER, id)
  })
})

it(`should handle ${SubscriptionNames.RAW_CAPTURE_CREATED} event`, async () => {
  await prepareRegionData(TableNames.RAW_CAPTURE_CLUSTER, kenyaData)
  await publishMessage(SubscriptionNames.RAW_CAPTURE_CREATED, kenyaData)
  const { id } = kenyaData
  await waitForExpect(async () => {
    await expectTableHasId(TableNames.RAW_CAPTURE_FEATURE, id)
  })
  await waitForExpect(async () => {
    await expectClusterHasRegionData(TableNames.RAW_CAPTURE_CLUSTER, id)
  })
})

it(`should handle ${SubscriptionNames.TOKEN_ASSIGNED} event`, async () => {
  // prepare the capture before the wallet event
  await knex(TableNames.CAPTURE_FEATURE).insert(captureData)
  const newWalletName = 'newone'

  const message = {
    type: 'TokensAssigned',
    wallet_name: newWalletName,
    entries: [{ capture_id: captureData.id, token_id: captureData.token_id }],
  }

  // publish the capture
  await publishMessage(SubscriptionNames.TOKEN_ASSIGNED, message)

  await waitForExpect(async () => {
    // check if message was consumed and handled
    const result = await knex(TableNames.CAPTURE_FEATURE)
      .select()
      .where('wallet_name', newWalletName)
    expect(result).toHaveLength(1)
  })
})

import data from '@mock/capture.json'
import waitForExpect from 'wait-for-expect'
import knex, { TableNames } from 'db/knex'
import { SubscriptionNames } from 'messaging/brokerConfig'
import registerEventHandlers from 'messaging/registerEventHandlers'
import { addCaptureFeature } from 'models/captureFeature'
import { publishMessage } from '@test/publisher'
import { truncateTables } from '@test/utils'

const message = {
  type: 'TokensAssigned',
  wallet_name: 'newone',
  entries: [{ capture_id: data.id, token_id: data.token_id }],
}

beforeAll(async () => {
  await registerEventHandlers()
})

beforeEach(async () => {
  await truncateTables([TableNames.CAPTURE_FEATURE])
})

it('Successfully handle tokenAssigned event', async () => {
  await addCaptureFeature(data)
  await publishMessage(SubscriptionNames.TOKEN_ASSIGNED, message)
  await waitForExpect(async () => {
    const result = await knex(TableNames.CAPTURE_FEATURE)
      .select()
      .where('wallet_name', message.wallet_name)
    expect(result).toHaveLength(1)
  })
})

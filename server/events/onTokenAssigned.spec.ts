import { TableNames } from 'db/knex'
import { SubscriptionNames } from 'messaging/brokerConfig'
import { batchUpdate } from 'models/base'
import data from '@test/mock/capture.json'
import onTokenAssigned from './onTokenAssigned'

const message = {
  type: 'TokensAssigned',
  wallet_name: 'newone',
  entries: [{ capture_id: data.id, token_id: data.token_id }],
}

const { wallet_name, entries } = message
const ids = entries.map((entry) => entry.capture_id)
const updateObject = {
  wallet_name,
}

jest.mock('models/base')

it(`Successfully handle ${SubscriptionNames.TOKEN_ASSIGNED} event`, async () => {
  await onTokenAssigned(message)

  expect(batchUpdate).toHaveBeenLastCalledWith(
    ids,
    updateObject,
    TableNames.CAPTURE_FEATURE,
  )
})

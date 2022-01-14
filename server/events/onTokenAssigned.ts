import { TableNames } from 'db/knex'
import { SubscriptionNames } from 'messaging/brokerConfig'
import { batchUpdate } from 'models/base'

type TokenMessage = {
  entries: {
    capture_id: string
  }[]
  wallet_name: string
}

export default async function onTokenAssigned(message: TokenMessage) {
  console.log(`${SubscriptionNames.TOKEN_ASSIGNED} message received`)
  const { wallet_name, entries } = message
  const ids = entries.map((entry) => entry.capture_id)
  const updateObject = {
    wallet_name,
  }
  await batchUpdate(ids, updateObject, TableNames.CAPTURE_FEATURE)
}

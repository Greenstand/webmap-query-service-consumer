import { TableNames } from 'db/knex'
import { batchUpdate } from 'models/base'

type TokenMessage = {
  entries: {
    capture_id: string
  }[]
  wallet_name: string
}

export default async function onTokenAssigned(message: TokenMessage) {
  try {
    console.log('token event handler received:', message)
    const { wallet_name, entries } = message
    const ids = entries.map((entry) => entry.capture_id)
    const updateObject = {
      wallet_name,
    }
    await batchUpdate(ids, updateObject, TableNames.CAPTURE_FEATURE)
    console.log('token event handler finished.')
  } catch (e) {
    console.error('Get error when handling message:', e)
  }
}

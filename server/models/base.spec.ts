import knex, { TableNames } from 'db/knex'
import data from '@test/mock/capture.json'
import { truncateTables } from '@test/utils'
import { batchUpdate } from './base'

beforeEach(async () => {
  await truncateTables([TableNames.CAPTURE_FEATURE])
})

it('should batchUpdate', async () => {
  // prepare the capture before the wallet event
  await knex(TableNames.CAPTURE_FEATURE).insert(data)
  const newWalletName = 'newone'
  const ids = [data.id]
  const updateObject = {
    wallet_name: newWalletName,
  }
  await batchUpdate(ids, updateObject, TableNames.CAPTURE_FEATURE)

  // check if message was consumed and handled
  const result = await knex(TableNames.CAPTURE_FEATURE)
    .select()
    .where('wallet_name', newWalletName)
  expect(result).toHaveLength(1)
})

import knex, { TableNames } from 'db/knex'
import data from '@test/mock/capture.json'
import { truncateTables } from '@test/utils'
import onTokenAssigned from './onTokenAssigned'

describe('tokenAssigned', () => {
  beforeEach(async () => {
    await truncateTables([TableNames.CAPTURE_FEATURE])
  })

  it('Successfully handle tokenAssigned event', async () => {
    // prepare the capture before the wallet event
    await knex(TableNames.CAPTURE_FEATURE).insert(data)
    const newWalletName = 'newone'
    const message = {
      type: 'TokensAssigned',
      wallet_name: newWalletName,
      entries: [{ capture_id: data.id, token_id: data.token_id }],
    }

    // publish the capture
    await onTokenAssigned(message)

    // check if message was consumed and handled
    const result = await knex(TableNames.CAPTURE_FEATURE)
      .select()
      .where('wallet_name', newWalletName)
    expect(result).toHaveLength(1)
  })
})

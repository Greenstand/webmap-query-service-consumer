import { expect } from 'chai'
import knex from 'infra/database/knex'
import { publish, unsubscribeAll } from 'infra/messaging/rabbit-mq-messaging'
import registerEventHandlers from 'services/event-handlers'

describe('tokenAssigned', () => {
  beforeEach(async () => {
    //load server
    registerEventHandlers()
    await knex('capture_feature').del()
  })

  afterEach(async () => {
    await unsubscribeAll()
  })

  it('Successfully handle tokenAssigned event', async () => {
    const capture_id = '63e00bca-8eb0-11eb-8dcd-0242ac130003'
    const token_id = '9d7abad8-8eb0-11eb-8dcd-0242ac130003'
    const capture = {
      id: capture_id,
      lat: 0,
      lon: 0,
      location: `POINT(0 0)`,
      field_user_id: 0,
      field_username: 'fake_name',
      token_id,
      wallet_name: 'oldone',
      capture_taken_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    }
    //prepare the capture before the wallet event
    await knex('capture_feature').insert(capture)
    const wallet_name_new = 'newone'
    const message = {
      type: 'TokensAssigned',
      wallet_name: wallet_name_new,
      entries: [{ capture_id: capture_id, token_id: token_id }],
    }
    publish('token-assigned', '', message, (e) => console.log('result:', e))
    await new Promise((r) => setTimeout(() => r(''), 2000))
    const result = await knex('capture_feature')
      .select()
      .where('wallet_name', wallet_name_new)
    expect(result).lengthOf(1)
  })
})

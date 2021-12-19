import { publish } from 'messaging/broker'
import config from 'messaging/config'
import { CaptureFeature } from 'models/captureFeature'
import { BrokerAsPromised } from 'rascal'
import registerEventHandlers from 'services/eventHandlers'
import knex from 'services/knex'

describe('tokenAssigned', () => {
  let broker: BrokerAsPromised

  beforeAll(async () => {
    try {
      broker = await BrokerAsPromised.create(config)
      broker.on('error', console.error)
      await registerEventHandlers(broker)
    } catch (err) {
      console.error(err)
    }
  })

  beforeEach(async () => {
    try {
      await broker.purge()
      await knex('capture_feature').truncate()
    } catch (err) {
      console.error(err)
    }
  })

  afterAll(async () => {
    try {
      if (!broker) return
      await broker.unsubscribeAll()
      await broker.nuke()
    } catch (err) {
      console.error(err)
    }
  })

  it('Successfully handle tokenAssigned event', async () => {
    //prepare the capture before the wallet event
    const capture_id = '3501b525-a932-4b41-9a5d-73e89feeb7e3'
    const token_id = '9d7abad8-8eb0-11eb-8dcd-0242ac130003'
    const wallet_name = 'oldone'
    const capture: CaptureFeature = {
      id: capture_id,
      lat: 0,
      lon: 0,
      location: `POINT(0 0)`,
      field_user_id: 0,
      field_username: 'fake_name',
      token_id,
      wallet_name,
      attributes: [],
      device_identifier: 'x',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    await knex('capture_feature').insert(capture)
    const wallet_name_new = 'newone'
    const message = {
      type: 'TokensAssigned',
      wallet_name: wallet_name_new,
      entries: [{ capture_id: capture_id, token_id: token_id }],
    }

    // publish the capture
    await publish(broker, 'token-assigned', 'token.transfer', message, (e) =>
      console.log('result:', e),
    )

    // wait for message to be consumed
    await new Promise((r) => setTimeout(() => r(''), 2000))

    // check if message was consumed and handled
    const result = await knex('capture_feature')
      .select()
      .where('wallet_name', wallet_name_new)
    expect(result).toHaveLength(1)
  })
})

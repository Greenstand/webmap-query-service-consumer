import knex, { TableNames } from 'db/knex'
import { getBroker, publish } from 'messaging/broker'
import { SubscriptionNames } from 'messaging/brokerConfig'
import registerEventHandlers from 'messaging/eventHandlers'
import { truncateTables } from 'models/base'
import { CaptureFeature } from 'models/captureFeature'
import waitForExpect from 'wait-for-expect'

const data: CaptureFeature = {
  id: '3501b525-a932-4b41-9a5d-73e89feeb7e3',
  lat: 0,
  lon: 0,
  location: `POINT(0 0)`,
  field_user_id: 0,
  field_username: 'fake_name',
  token_id: '9d7abad8-8eb0-11eb-8dcd-0242ac130003',
  wallet_name: 'oldone',
  attributes: [],
  device_identifier: 'x',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

describe('tokenAssigned', () => {
  beforeAll(async () => {
    await registerEventHandlers()
  })

  beforeEach(async () => {
    const broker = await getBroker()
    await broker.purge()
    await truncateTables([TableNames.CAPTURE_FEATURE])
  })

  afterAll(async () => {
    const broker = await getBroker()
    await broker.unsubscribeAll()
    await broker.nuke()
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
    await publish(
      SubscriptionNames.TOKEN_ASSIGNED,
      'token.transfer',
      message,
      (e) => console.log('result:', e),
    )

    await waitForExpect(async () => {
      // check if message was consumed and handled
      const result = await knex(TableNames.CAPTURE_FEATURE)
        .select()
        .where('wallet_name', newWalletName)
      expect(result).toHaveLength(1)
    })
  })
})

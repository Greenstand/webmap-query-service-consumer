import knex from 'infra/database/knex'
import {
  CaptureFeature,
  captureFeatureFromMessage,
} from 'models/capture-feature'

import CaptureFeatureRepository from './CaptureFeatureRepository'
import Session from './session'

const data: CaptureFeature = {
  id: '63e00bca-8eb0-11eb-8dcd-0242ac130003',
  lat: 0.6383533333333336,
  lon: 37.663318333333336,
  location: '',
  field_user_id: 0,
  field_username: 'fake_name',
  token_id: '9d7abad8-8eb0-11eb-8dcd-0242ac130003',
  wallet_name: 'oldone',
  device_identifier: 'x',
  attributes: [],
  created_at: '2021-07-09T03:58:07.814Z',
  updated_at: '2021-07-09T03:58:07.814Z',
}

describe('Capture Feature Repo', () => {
  let repo: CaptureFeatureRepository | undefined

  beforeAll(() => {
    const session = new Session()
    repo = new CaptureFeatureRepository(session)
  })

  beforeEach(async () => {
    await knex('raw_capture_feature').del()
    await knex('capture_feature').del()
  })

  it('add', async () => {
    if (!repo) return
    const x = await repo.add(captureFeatureFromMessage(data))
    console.log(x)

    let result = await knex('capture_feature').select().where('id', data.id)
    expect(result).toHaveLength(1)
  })
})

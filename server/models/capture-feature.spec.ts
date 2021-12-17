import knex from 'infra/database/knex'

import {
  CaptureFeature,
  captureFeatureFromMessage,
  createCaptureFeature,
} from './capture-feature'

const exampleData: CaptureFeature = {
  id: 'd13f0b9e-d067-48b4-a5da-46d5655c54dd',
  lat: 11.43,
  lon: 30.56,
  location: '',
  field_user_id: 12315,
  token_id: '12315',
  wallet_name: '12315',
  field_username: 'joeplanter',
  attributes: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  device_identifier: '1',
}

describe('Creating CaptureFeature', () => {
  beforeEach(async () => {
    // clear db
    await knex('capture_feature').del()
  })

  const captureFeature = captureFeatureFromMessage(exampleData)

  it('should add the object to the repository', async () => {
    await createCaptureFeature(captureFeature)
  })
})

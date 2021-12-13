import CaptureFeatureRepository from 'infra/database/CaptureFeatureRepository'
import knex from 'infra/database/knex'
import Session from 'infra/database/session'

import {
  CaptureFeature,
  captureFeatureFromMessage,
  createCaptureFeature,
} from './capture-feature'

const exampleData: CaptureFeature = {
  id: 'd13f0b9e-d067-48b4-a5da-46d5655c54dd',
  lat: 11.43,
  lon: 30.56,
  field_user_id: 12315,
  field_username: 'joeplanter',
  attributes: [],
  species_name: 'neem',
  created_at: new Date().toISOString(),
  device_identifier: '1',
}

describe('Creating CaptureFeature', () => {
  beforeEach(async () => {
    // clear db
    await knex('capture_feature').del()
  })

  const session = new Session()
  const captureFeatureRepo = new CaptureFeatureRepository(session)
  const stub = jest.spyOn(captureFeatureRepo, 'add')
  const captureFeature = captureFeatureFromMessage(exampleData)
  const saveCaptureFeature = createCaptureFeature(captureFeatureRepo)

  it('should add the object to the repository', async () => {
    await saveCaptureFeature(captureFeature)
    expect(stub).toHaveBeenCalledWith(captureFeature)
    stub.mockRestore()
  })
})

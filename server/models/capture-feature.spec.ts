import { CaptureFeatureRepository } from 'infra/database/pg-repositories'
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
  created_at: Date(),
  device_identifier: '1',
}

describe('Creating CaptureFeature', () => {
  const session = new Session()
  const captureRepository = new CaptureFeatureRepository(session)
  const stub = jest.spyOn(captureRepository, 'add')
  const captureFeature = captureFeatureFromMessage(exampleData)
  const saveCaptureFeature = createCaptureFeature(captureRepository)

  it('should add the object to the repository', async () => {
    await saveCaptureFeature(captureFeature)
    expect(stub).toHaveBeenCalledWith(captureFeature)
    stub.mockRestore()
  })
})

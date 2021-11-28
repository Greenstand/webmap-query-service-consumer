import { CaptureFeatureRepository } from 'infra/database/pg-repositories'
import Session from 'infra/database/session'

import {
  captureFeatureFromMessage,
  createCaptureFeature,
  Message,
} from './capture-feature'

const exampleData: Message = {
  id: 'd13f0b9e-d067-48b4-a5da-46d5655c54dd',
  lat: 11.43,
  lon: 30.56,
  field_user_id: 12315,
  field_username: 'joeplanter',
  attributes: [],
  species_name: 'neem',
  created_at: Date(),
  age: 12,
  morphology: 'medium sized',
  device_identifier: '1',
}

// test not necessary with Typescript
describe('captureFeatureFromMessage function', () => {
  it('should return a immutable CaptureFeature object', () => {
    const captureFeature = captureFeatureFromMessage(exampleData)
    expect(captureFeature.additional_attr).toBeUndefined()
  })
})

describe('invoking captureFeatureFromMessage with variable parameters', () => {
  it('should add them as key-value pairs in parameter named attributes', () => {
    const captureFeature = captureFeatureFromMessage(exampleData)
    let additionalArgs = 0
    captureFeature.attributes.forEach((attribute) => {
      if (attribute.age && attribute.age === 12) {
        additionalArgs++
      }
      if (attribute.morphology && attribute.morphology === 'medium sized') {
        additionalArgs++
      }
    })
    expect(additionalArgs).toBe(2)
  })
})

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

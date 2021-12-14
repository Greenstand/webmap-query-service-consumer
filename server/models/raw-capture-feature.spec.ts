import RawCaptureFeatureRepository from 'infra/database/RawCaptureFeatureRepository'
import Session from 'infra/database/session'

import {
  createRawCaptureFeature,
  rawCaptureFeatureFromMessage,
} from './raw-capture-feature'

describe('rawCaptureFeatureFromMessage function', () => {
  const rawCaptureFeature = rawCaptureFeatureFromMessage({
    id: 'bc53bc67-894b-4cec-8adf-d77bd00f6c67',
    lat: 23.12,
    lon: 64.23,
    field_user_id: 432523,
    field_username: 'planter',
    attributes: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    device_identifier: 1,
  })

  it('should contain the required parameters', () => {
    expect(Object.keys(rawCaptureFeature)).toStrictEqual([
      'id',
      'lat',
      'lon',
      'field_user_id',
      'field_username',
      'attributes',
      'device_identifier',
      'created_at',
      'updated_at',
    ])
  })
})

describe('calling createRawCaptureFeature function', () => {
  const rawCaptureFeature = rawCaptureFeatureFromMessage({
    id: 'bc53bc67-894b-4cec-8adf-d77bd00f6c67',
    lat: 23.12,
    lon: 64.23,
    field_user_id: 432523,
    field_username: 'planter',
    attributes: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    device_identifier: 1,
  })

  it('should add the raw capture feature to the repository', async () => {
    const session = new Session()

    const rawCaptureFeatureRepository = new RawCaptureFeatureRepository(session)
    rawCaptureFeatureRepository.add = jest.fn()
    const executeCreateRawCaptureFeature = createRawCaptureFeature(
      rawCaptureFeatureRepository,
    )
    await executeCreateRawCaptureFeature(rawCaptureFeature)
    expect(rawCaptureFeatureRepository.add).toHaveBeenCalledWith(
      rawCaptureFeature,
    )
  })
})

import assertArrays from 'chai-arrays'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import { RawCaptureFeatureRepository } from '../infra/database/pg-repositories'
import Session from '../infra/database/session'
import {
  createRawCaptureFeature,
  rawCaptureFeatureFromMessage,
} from './raw-capture-feature'

chai.use(sinonChai)
chai.use(assertArrays)
const { expect } = chai

describe('rawCaptureFeatureFromMessage function', () => {
  const rawCaptureFeature = rawCaptureFeatureFromMessage({
    id: 'bc53bc67-894b-4cec-8adf-d77bd00f6c67',
    lat: 23.12,
    lon: 64.23,
    field_user_id: 432523,
    field_username: 'planter',
    attributes: [],
    created_at: new Date().toISOString(),
    device_identifier: 1,
    species_name: 'species',
  })

  it('should contain the required parameters', () => {
    expect(Object.keys(rawCaptureFeature)).to.equal([
      'id',
      'lat',
      'lon',
      'field_user_id',
      'field_username',
      'attributes',
      'device_identifier',
      'created_at',
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
    identifier: '34fwaasdgsasfd',
    created_at: new Date().toISOString(),
    device_identifier: 1,
    species_name: 'species',
  })

  it('should add the raw capture feature to the repository', async () => {
    const session = new Session()
    const rawCaptureFeatureRepository = new RawCaptureFeatureRepository(session)
    const stub = sinon.stub(rawCaptureFeatureRepository, 'add')
    const executeCreateRawCaptureFeature = createRawCaptureFeature(
      rawCaptureFeatureRepository,
    )
    await executeCreateRawCaptureFeature(rawCaptureFeature)
    expect(stub).calledWith(rawCaptureFeature)
    stub.restore()
  })
})

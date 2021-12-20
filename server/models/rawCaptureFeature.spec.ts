import knex, { TableNames } from 'services/knex'

import { truncateTables } from './base'
import {
  addRawCapture,
  assignRegion,
  RawCaptureFeature,
} from './rawCaptureFeature'

const data: RawCaptureFeature = {
  id: '63e00bca-8eb0-11eb-8dcd-0242ac130003',
  lat: 0.6383533333333336,
  lon: 37.663318333333336,
  field_user_id: 0,
  field_username: 'fake_name',
  device_identifier: 'x',
  attributes: [],
  created_at: '2021-07-09T03:58:07.814Z',
  updated_at: '2021-07-09T03:58:07.814Z',
}

const tables = [TableNames.RAW_CAPTURE_FEATRURE, TableNames.REGION_ASSIGNMENT]

describe('calling createRawCaptureFeature function', () => {
  beforeEach(async () => {
    await truncateTables(tables)
  })

  it('add and assign region', async () => {
    await addRawCapture(data)
    const addResult = await knex('raw_capture_feature')
      .select()
      .where('id', data.id)
    expect(addResult).toHaveLength(1)
    await assignRegion(data)
    const assignRegionResult = await knex('region_assignment').select().where({
      map_feature_id: data.id,
      zoom_level: 9,
      region_id: 2281072,
    })
    expect(assignRegionResult).toHaveLength(1)
  })
})

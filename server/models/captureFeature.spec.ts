import data from '@test/mock/capture_in_kenya.json'
import { truncateTables } from '@test/utils'
import knex, { TableNames } from 'db/knex'
import { addCaptureFeature, assignCaptureFeatureRegion } from './captureFeature'

describe('Creating CaptureFeature', () => {
  beforeAll(async () => {
    await truncateTables([
      TableNames.CAPTURE_FEATURE,
      TableNames.REGION_ASSIGNMENT,
    ])
  })

  it('should add the object to the db', async () => {
    const x = await addCaptureFeature(data)
    expect(x?.id).toEqual(data.id)
    console.log(x)
    const result = await knex(TableNames.CAPTURE_FEATURE)
      .select()
      .where('id', data.id)
    expect(result).toHaveLength(1)
  })

  it('should assign region', async () => {
    await assignCaptureFeatureRegion(data)
    const assignRegionResult = await knex(TableNames.REGION_ASSIGNMENT)
      .select()
      .where({
        map_feature_id: data.id,
        zoom_level: 9,
        region_id: 2281072,
      })
    expect(assignRegionResult).toHaveLength(1)
  })
})

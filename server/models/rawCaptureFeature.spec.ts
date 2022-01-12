import knex, { TableNames } from 'db/knex'
import data from '@test/mock/capture_in_kenya.json'
import { truncateTables } from '@test/utils'
import { addRawCapture, assignRawCaptureRegion } from './rawCaptureFeature'

const tables = [TableNames.RAW_CAPTURE_FEATURE, TableNames.REGION_ASSIGNMENT]

describe('calling createRawCaptureFeature function', () => {
  beforeAll(async () => {
    await truncateTables(tables)
  })

  it('should add the object to the db', async () => {
    const x = await addRawCapture(data)
    expect(x?.id).toEqual(data.id)
    console.log(x)
    const result = await knex(TableNames.RAW_CAPTURE_FEATURE)
      .select()
      .where('id', data.id)
    expect(result).toHaveLength(1)
  })

  it('should assign region', async () => {
    await assignRawCaptureRegion(data)
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

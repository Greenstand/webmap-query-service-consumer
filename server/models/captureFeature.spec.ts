import { truncateTables } from '@test/utils'
import knex, { TableNames } from 'db/knex'
import { addCaptureFeature, CaptureFeature } from './captureFeature'

const data: CaptureFeature = {
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
    await truncateTables([TableNames.CAPTURE_FEATURE])
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
})

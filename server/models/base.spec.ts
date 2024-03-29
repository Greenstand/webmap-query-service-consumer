import data from '@mock/capture.json'
import data2 from '@mock/capture_in_kenya.json'
import knex, { TableNames } from 'db/knex'
import CaptureFeature from 'interfaces/CaptureFeature'
import { truncateTables } from '@test/utils'
import {
  batchUpdate,
  getFeatureById,
  updateImpactProducer,
  updateImpactProducers,
} from './base'
import { addCaptureFeature } from './captureFeature'

beforeEach(async () => {
  await truncateTables([
    TableNames.CAPTURE_FEATURE, //
  ])
})

it('should batchUpdate', async () => {
  // prepare the capture before the wallet event
  await knex(TableNames.CAPTURE_FEATURE).insert(data)
  const newWalletName = 'newone'
  const ids = [data.id]
  const updateObject = {
    wallet_name: newWalletName,
  }
  await batchUpdate(ids, updateObject, TableNames.CAPTURE_FEATURE)

  // check if message was consumed and handled
  const result = await knex(TableNames.CAPTURE_FEATURE)
    .select()
    .where('wallet_name', newWalletName)
  expect(result).toHaveLength(1)
})

it('should get feature by id', async () => {
  // prepare the capture before the wallet event
  await addCaptureFeature(data)
  const result: CaptureFeature = await getFeatureById(
    TableNames.CAPTURE_FEATURE,
    data.id,
  )
  expect(result.id).toBe(data.id)
})

it('should update impact producer', async () => {
  // prepare the capture before the wallet event
  await addCaptureFeature(data)
  const newImpactProducer = 'new123'
  await updateImpactProducer(
    TableNames.CAPTURE_FEATURE,
    data.id,
    newImpactProducer,
  )
  const result: CaptureFeature = await getFeatureById(
    TableNames.CAPTURE_FEATURE,
    data.id,
  )
  expect(result.map?.impact_producer).toBe(newImpactProducer)
  expect(result.map?.impact_manager).toBe(data.map.impact_manager)
})

it('should update multiple impact producer', async () => {
  // prepare the capture before the wallet event
  await addCaptureFeature(data)
  await addCaptureFeature(data2)
  const newImpactProducer = 'new123'
  await updateImpactProducers(
    TableNames.CAPTURE_FEATURE,
    [data.id, data2.id],
    newImpactProducer,
  )
  const result: CaptureFeature = await getFeatureById(
    TableNames.CAPTURE_FEATURE,
    data.id,
  )
  expect(result.map?.impact_producer).toBe(newImpactProducer)
  expect(result.map?.impact_manager).toBe(data.map.impact_manager)
})

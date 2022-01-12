import { TableNames } from 'db/knex'
import { batchUpdate } from 'models/base'
import { getStakeholderMap } from 'models/stakeholder'

export type MapFeatureKinds = 'raw_capture' | 'capture'

export type MapNameAssigned = {
  type: string
  impact_producer_id: string
  map_feature_ids: string[]
  map_feature_kind: MapFeatureKinds
}

const tableNameByMapFeatureKind: { [key in MapFeatureKinds]: TableNames } = {
  capture: TableNames.CAPTURE_FEATURE,
  raw_capture: TableNames.RAW_CAPTURE_FEATURE,
}

export default async function onMapNameAssigned(message: MapNameAssigned) {
  try {
    console.log('token event handler received:', message)
    const {
      impact_producer_id,
      map_feature_ids: ids,
      map_feature_kind,
    } = message
    const map = await getStakeholderMap(impact_producer_id)
    const updateObject = {
      map,
    }
    await batchUpdate(
      ids,
      updateObject,
      tableNameByMapFeatureKind[map_feature_kind],
    )
    console.log('token event handler finished.')
  } catch (e) {
    console.error('Get error when handling message:', e)
  }
}

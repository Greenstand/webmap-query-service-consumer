import { TableNames } from 'db/knex'
import { batchUpdate } from 'models/base'
import { getStakeholderMap } from 'models/stakeholder'

type Message = {
  type: string
  impact_producer_id: string
  map_feature_ids: string[]
  map_feature_kind: 'raw_capture' | 'capture' | 'tree'
}

export default async function onMapNameAssigned(message: Message) {
  try {
    console.log('token event handler received:', message)
    const {
      impact_producer_id,
      map_feature_ids: ids,
      // map_feature_kind,
    } = message
    const map = await getStakeholderMap(impact_producer_id)
    const updateObject = {
      map,
    }
    await batchUpdate(ids, updateObject, TableNames.CAPTURE_FEATURE)
    console.log('token event handler finished.')
  } catch (e) {
    console.error('Get error when handling message:', e)
  }
}

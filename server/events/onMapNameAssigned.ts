import { TableNames } from 'db/knex'
import CaptureFeature from 'interfaces/CaptureFeature'
import MapNameMessage, {
  MapFeatureKinds,
} from 'interfaces/messages/MapNameAssigned'
import { batchUpdate } from 'models/base'
import { getStakeholderMap } from 'utils/stakeholderApi'

const tableNameByMapFeatureKind: { [key in MapFeatureKinds]: TableNames } = {
  capture: TableNames.CAPTURE_FEATURE,
  raw_capture: TableNames.RAW_CAPTURE_FEATURE,
}

export default async function onMapNameAssigned(message: MapNameMessage) {
  const { impact_producer_id, map_feature_ids, map_feature_kind } = message
  const map = await getStakeholderMap(impact_producer_id)

  const updateObject = {
    map_name: { map, impact_producer: impact_producer_id },
  } as Partial<CaptureFeature>
  await batchUpdate(
    map_feature_ids,
    updateObject,
    tableNameByMapFeatureKind[map_feature_kind],
  )
}

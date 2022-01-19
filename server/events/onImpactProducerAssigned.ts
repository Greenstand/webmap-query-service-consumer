import { TableNames } from 'db/knex'
import ImpactProducerAssigned, {
  MapFeatureKinds,
} from 'interfaces/messages/ImpactProducerAssigned'
import { updateImpactProducers } from 'models/base'
import { getStakeholderMap } from 'utils/stakeholderApi'

const tableNameByMapFeatureKind: { [key in MapFeatureKinds]: TableNames } = {
  capture: TableNames.CAPTURE_FEATURE,
  raw_capture: TableNames.RAW_CAPTURE_FEATURE,
}

export default async function onImpactProducerAssigned(
  message: ImpactProducerAssigned,
) {
  const { impact_producer_id, map_feature_ids, map_feature_kind } = message
  const map = await getStakeholderMap(impact_producer_id)
  if (!map) return console.error('map not found')
  const tableName = tableNameByMapFeatureKind[map_feature_kind]
  await updateImpactProducers(tableName, map_feature_ids, map)
}

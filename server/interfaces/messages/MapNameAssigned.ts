export type MapFeatureKinds = 'raw_capture' | 'capture'

export default interface MapNameMessage {
  type: string
  impact_producer_id: string
  map_feature_ids: string[]
  map_feature_kind: MapFeatureKinds
}

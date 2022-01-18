import Attributes from './Attribute'
import FeatureMap from './FeatureMap'

export type RawCaptureFeature = {
  id: number | string
  lat: number
  lon: number
  field_user_id: number | string
  field_username: string
  attributes: Attributes
  device_identifier: string | number
  created_at: string
  updated_at: string
  map?: FeatureMap
}

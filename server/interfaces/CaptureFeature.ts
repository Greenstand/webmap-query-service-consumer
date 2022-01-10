import Attributes from './Attribute'

export default interface CaptureFeature {
  id: number | string
  lat: number
  lon: number
  location: string
  field_user_id: number | string
  field_username: string
  attributes: Attributes
  device_identifier: string | number
  created_at: string
  updated_at: string
  token_id: string
  wallet_name: string
}

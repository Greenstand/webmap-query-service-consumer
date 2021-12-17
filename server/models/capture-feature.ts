import CaptureFeatureRepository, {
  addCaptureFeature,
} from 'infra/database/CaptureFeatureRepository'
import log from 'loglevel'

export type Attribute = {
  key: string
  value: any
}

export type CaptureFeature = {
  id: number | string
  lat: number
  lon: number
  location: string
  field_user_id: number | string
  field_username: string
  attributes: Attribute[]
  device_identifier: string | number
  created_at: string
  updated_at: string
  token_id: string
  wallet_name: string
}

export const captureFeatureFromMessage = ({
  id,
  lat,
  lon,
  field_user_id,
  field_username,
  device_identifier,
  attributes,
  created_at,
}: CaptureFeature): Readonly<CaptureFeature> => {
  return {
    id,
    lat,
    lon,
    field_user_id,
    field_username,
    device_identifier,
    attributes,
    created_at,
  } as Readonly<CaptureFeature>
}

export async function createCaptureFeature(captureFeature: CaptureFeature) {
  await addCaptureFeature(captureFeature)
}

export function updateCaptureFeature<T>(
  captureFeatureRepo: CaptureFeatureRepository,
) {
  return async (captureFeatureIds: string[], captureFeatureUpdateObject: T) => {
    log.log('repo:', captureFeatureRepo)
    // Because here is using a special fn to update db, so didn't use Repository
    await captureFeatureRepo.batchUpdate(
      captureFeatureIds,
      captureFeatureUpdateObject,
    )
  }
}

import CaptureFeatureRepository from 'infra/database/CaptureFeatureRepository'
import log from 'loglevel'
import Repository from 'models/Repository'

export type Attribute = {
  key: string
  value: any
}

export type CaptureFeature = {
  id: number | string
  lat: number | string
  lon: number | string
  field_user_id: number | string
  field_username: string
  attributes: Attribute[]
  device_identifier: string | number
  created_at: string
  species_name: string
}

export const captureFeatureFromMessage = ({
  id,
  lat,
  lon,
  field_user_id,
  field_username,
  device_identifier,
  attributes,
  species_name,
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
    species_name,
    created_at,
  } as Readonly<CaptureFeature>
}

export const createCaptureFeature =
  (captureFeatureRepo: CaptureFeatureRepository) =>
  async (captureFeature: CaptureFeature) => {
    const repository = new Repository(captureFeatureRepo)
    await repository.add(captureFeature)
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

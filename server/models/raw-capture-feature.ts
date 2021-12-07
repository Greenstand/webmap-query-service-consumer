import { RawCaptureFeatureRepository } from 'infra/database/pg-repositories'

import { Attribute } from './capture-feature'
import Repository from './Repository'

export type RawCaptureFeature = {
  id: number | string
  lat: number | string
  lon: number | string
  field_user_id: number | string
  field_username: string
  attributes: Attribute[]
  device_identifier: string | number
  created_at: string
}

export const rawCaptureFeatureFromMessage = ({
  id,
  lat,
  lon,
  field_user_id,
  field_username,
  attributes,
  device_identifier = '',
  created_at,
}: RawCaptureFeature) => {
  return Object.freeze({
    id,
    lat,
    lon,
    field_user_id,
    field_username,
    attributes,
    device_identifier,
    created_at,
  })
}

export const createRawCaptureFeature =
  (rawCaptureFeatureRepo: RawCaptureFeatureRepository) =>
  async (rawCaptureFeature: RawCaptureFeature) => {
    const repository = new Repository(rawCaptureFeatureRepo)
    await repository.add(rawCaptureFeature)

    // update region
    await rawCaptureFeatureRepo.assignRegion(rawCaptureFeature)

    // update cluster
    await rawCaptureFeatureRepo.updateCluster(rawCaptureFeature)
  }
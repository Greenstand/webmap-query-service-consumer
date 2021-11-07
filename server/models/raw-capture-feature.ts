import { RawCaptureFeatureRepository } from 'infra/database/pg-repositories'

import Repository from './Repository'

export type RawCapture = {
  id: string
  lat: string
  lon: string
  field_user_id: string
  field_username: string
  attributes: string[]
  device_identifier: string
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
}: RawCapture) => {
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
  async (rawCaptureFeature: RawCapture) => {
    const repository = new Repository(rawCaptureFeatureRepo)
    repository.add(rawCaptureFeature)
  }

import { CaptureFeatureRepository } from 'infra/database/pg-repositories'
import log from 'loglevel'
import Repository from 'models/Repository'

import { RawCapture } from './raw-capture-feature'

export type Message = RawCapture & {
  species_name: string
} & { [key: string]: any }

export const captureFeatureFromMessage = ({
  id,
  lat,
  lon,
  field_user_id,
  field_username,
  device_identifier,
  attributes = [],
  species_name,
  created_at,
  ...additionalParameters
}: Message): Readonly<Message> => {
  Object.keys(additionalParameters).forEach((key) => {
    attributes.push(`${key}: ${additionalParameters[key]}`)
  })
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
  } as Readonly<Message>
}

export const createCaptureFeature =
  (captureFeatureRepo: CaptureFeatureRepository) =>
  async (captureFeature: Message) => {
    const repository = new Repository(captureFeatureRepo)
    repository.add(captureFeature)
  }

export const updateCaptureFeature =
  <T>(captureFeatureRepo: CaptureFeatureRepository) =>
  async (captureFeatureIds: string[], captureFeatureUpdateObject: T) => {
    log.warn('repo:', captureFeatureRepo)
    // Because here is using a special fn to update db, so didn't use Repository
    await captureFeatureRepo.batchUpdate(
      captureFeatureIds,
      captureFeatureUpdateObject,
    )
  }

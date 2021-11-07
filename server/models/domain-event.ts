import { RawCaptureFeatureRepository } from 'infra/database/pg-repositories'
import { v4 as uuidv4 } from 'uuid'

import Repository from './Repository'

export const DomainEvent = <T>(payload: T) =>
  Object.freeze({
    id: uuidv4(),
    payload,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

export const raiseEvent =
  (eventRepositoryImpl: RawCaptureFeatureRepository) =>
  async (domainEvent: any) => {
    const eventRepository = new Repository(eventRepositoryImpl)
    return eventRepository.add({ ...domainEvent, status: 'raised' })
  }

export const receiveEvent =
  (eventRepositoryImpl: RawCaptureFeatureRepository) =>
  async (domainEvent: any) => {
    const eventRepository = new Repository(eventRepositoryImpl)
    return eventRepository.add({ ...domainEvent, status: 'received' })
  }

export const dispatch =
  (eventRepositoryImpl: RawCaptureFeatureRepository, publishToTopic: any) =>
  async (domainEvent: any) => {
    publishToTopic(domainEvent.payload, () => {
      eventRepositoryImpl.update({
        ...domainEvent,
        status: 'sent',
        updated_at: new Date().toISOString(),
      })
    })
  }

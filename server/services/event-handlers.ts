import {
  CaptureFeatureRepository,
  RawCaptureFeatureRepository,
} from 'infra/database/pg-repositories'
import Session from 'infra/database/session'
import { subscribe } from 'infra/messaging/rabbit-mq-messaging'
import log from 'loglevel'
import {
  captureFeatureFromMessage,
  createCaptureFeature,
  Message,
} from 'models/capture-feature'
import {
  createRawCaptureFeature,
  rawCaptureFeatureFromMessage,
} from 'models/raw-capture-feature'
import tokenAssignedHandler from 'services/event-token-assigned-handler'

const createCaptureFeatureHandler = async (message: Message) => {
  const newCaptureFeature = captureFeatureFromMessage({ ...message })
  const dbSession = new Session()
  const captureFeatureRepo = new CaptureFeatureRepository(dbSession)
  createCaptureFeature(captureFeatureRepo)(newCaptureFeature)
}

const createRawCaptureFeatureHandler = async (message: Message) => {
  try {
    log.warn('createRawCaptureFeatureHandler...', message)
    const newRawCaptureFeature = rawCaptureFeatureFromMessage({ ...message })
    const dbSession = new Session()
    const rawCaptureFeatureRepo = new RawCaptureFeatureRepository(dbSession)
    const executeRawCreateCaptureFeature = createRawCaptureFeature(
      rawCaptureFeatureRepo,
    )
    await executeRawCreateCaptureFeature(newRawCaptureFeature)
  } catch (e) {
    log.error('Get error when handling message:', e)
  }
}

export default function registerEventHandlers() {
  subscribe('capture-created', createCaptureFeatureHandler)
  subscribe('raw-capture-created', createRawCaptureFeatureHandler)
  subscribe('token-assigned', tokenAssignedHandler)
}

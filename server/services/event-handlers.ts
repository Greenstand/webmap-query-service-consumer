import CaptureFeatureRepository from 'infra/database/CaptureFeatureRepository'
import RawCaptureFeatureRepository from 'infra/database/RawCaptureFeatureRepository'
import Session from 'infra/database/session'
import { subscribe } from 'infra/messaging/rabbit-mq-messaging'
import log from 'loglevel'
import {
  CaptureFeature,
  captureFeatureFromMessage,
  createCaptureFeature,
} from 'models/capture-feature'
import {
  createRawCaptureFeature,
  rawCaptureFeatureFromMessage,
} from 'models/raw-capture-feature'
import { BrokerAsPromised } from 'rascal'
import tokenAssignedHandler from 'services/event-token-assigned-handler'

const captureFeatureCreatedHandler = async (message: CaptureFeature) => {
  const newCaptureFeature = captureFeatureFromMessage({ ...message })
  const dbSession = new Session()
  const captureFeatureRepo = new CaptureFeatureRepository(dbSession)
  createCaptureFeature(captureFeatureRepo)(newCaptureFeature)
}

const rawCaptureCreatedHandler = (message: CaptureFeature) => {
  console.log('received message', message)
  const newRawCaptureFeature = rawCaptureFeatureFromMessage({ ...message })
  const dbSession = new Session()
  const rawCaptureFeatureRepo = new RawCaptureFeatureRepository(dbSession)
  const executeCreateRawCaptureFeature = createRawCaptureFeature(
    rawCaptureFeatureRepo,
  )
  return executeCreateRawCaptureFeature(newRawCaptureFeature)
}

export default async function registerEventHandlers(broker: BrokerAsPromised) {
  try {
    await subscribe(broker, 'capture-created', captureFeatureCreatedHandler)
    await subscribe(broker, 'raw-capture-created', rawCaptureCreatedHandler)
    await subscribe(broker, 'token-assigned', tokenAssignedHandler)
  } catch (e) {
    log.error('Get error when handling message:', e)
  }
}

import { batchUpdate } from 'db'
import {
  addRawCapture,
  assignRegion,
  updateCluster,
} from 'infra/database/RawCaptureFeatureRepository'
import { subscribe, TokenMessage } from 'infra/messaging/rabbit-mq-messaging'
import log from 'loglevel'
import {
  CaptureFeature,
  captureFeatureFromMessage,
  createCaptureFeature,
} from 'models/capture-feature'
import { rawCaptureFeatureFromMessage } from 'models/raw-capture-feature'
import { BrokerAsPromised } from 'rascal'

async function captureFeatureCreatedHandler(message: CaptureFeature) {
  try {
    const captureFeature = captureFeatureFromMessage({ ...message })
    await createCaptureFeature(captureFeature)
  } catch (e) {
    log.error(e)
  }
}

async function rawCaptureCreatedHandler(message: CaptureFeature) {
  try {
    log.log('received raw capture event message', message)
    const rawCaptureFeature = rawCaptureFeatureFromMessage({ ...message })
    await addRawCapture(rawCaptureFeature)
    await assignRegion(rawCaptureFeature)
    await updateCluster(rawCaptureFeature)
    console.log('raw capture event handler finished')
  } catch (e) {
    log.error(e)
  }
}

async function tokenAssignedHandler(message: TokenMessage) {
  try {
    log.log('token event handler received:', message)
    const { wallet_name, entries } = message
    const ids = entries.map((entry) => entry.capture_id)
    const updateObject = {
      wallet_name,
    }
    await batchUpdate(ids, updateObject, 'capture_feature')
    log.log('token event handler finished.')
  } catch (e) {
    log.error('Get error when handling message:', e)
  }
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

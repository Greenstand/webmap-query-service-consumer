import log from 'loglevel'
import { subscribe, TokenMessage } from 'messaging/broker'
import { batchUpdate, TableName } from 'models/base'
import {
  addCaptureFeature,
  CaptureFeature,
  captureFeatureFromMessage,
} from 'models/captureFeature'
import {
  addRawCapture,
  assignRegion,
  updateCluster,
} from 'models/rawCaptureFeature'
import { rawCaptureFeatureFromMessage } from 'models/rawCaptureFeature'
import { BrokerAsPromised } from 'rascal'

async function captureFeatureCreatedHandler(message: CaptureFeature) {
  try {
    const captureFeature = captureFeatureFromMessage({ ...message })
    await addCaptureFeature(captureFeature)
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
    await batchUpdate(ids, updateObject, TableName.CAPTURE_FEATURE)
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

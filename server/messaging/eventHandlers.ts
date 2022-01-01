import { TableNames } from 'db/knex'
import { subscribe } from 'messaging/broker'
import { batchUpdate } from 'models/base'
import { addCaptureFeature, CaptureFeature } from 'models/captureFeature'
import {
  addRawCapture,
  assignRegion,
  updateCluster,
} from 'models/rawCaptureFeature'
import { SubscriptionNames } from './brokerConfig'

async function captureFeatureCreatedHandler(message: CaptureFeature) {
  try {
    console.log('received capture feature event message', message)
    await addCaptureFeature(message)
  } catch (e) {
    console.error(e)
  }
}

async function rawCaptureCreatedHandler(message: CaptureFeature) {
  try {
    console.log('received raw capture event message', message)
    const rawCaptureFeature = { ...message }
    await addRawCapture(rawCaptureFeature)
    await assignRegion(rawCaptureFeature)
    await updateCluster(rawCaptureFeature)
    console.log('raw capture event handler finished')
  } catch (e) {
    console.error(e)
  }
}

export type TokenMessage = {
  entries: {
    capture_id: string
  }[]
  wallet_name: string
}

async function tokenAssignedHandler(message: TokenMessage) {
  try {
    console.log('token event handler received:', message)
    const { wallet_name, entries } = message
    const ids = entries.map((entry) => entry.capture_id)
    const updateObject = {
      wallet_name,
    }
    await batchUpdate(ids, updateObject, TableNames.CAPTURE_FEATURE)
    console.log('token event handler finished.')
  } catch (e) {
    console.error('Get error when handling message:', e)
  }
}

export default async function registerEventHandlers() {
  try {
    await subscribe(
      SubscriptionNames.CAPTURE_FEATURE,
      captureFeatureCreatedHandler,
    )
    await subscribe(
      SubscriptionNames.RAW_CAPTURE_CREATED,
      rawCaptureCreatedHandler,
    )
    await subscribe(SubscriptionNames.TOKEN_ASSIGNED, tokenAssignedHandler)
  } catch (e) {
    console.error('Get error when handling message:', e)
  }
}

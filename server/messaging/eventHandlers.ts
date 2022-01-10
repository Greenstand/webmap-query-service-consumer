import { TableNames } from 'db/knex'
import CaptureFeature from 'interfaces/CaptureFeature'
import { RawCaptureFeature } from 'interfaces/RawCaptureFeature'
import { TokenMessage } from 'interfaces/TokenMessage'
import { subscribe } from 'messaging/broker'
import { batchUpdate } from 'models/base'
import captureFeature from 'models/captureFeature'
import rawCaptureFeature from 'models/rawCaptureFeature'
import { SubscriptionNames } from './brokerConfig'

async function captureFeatureCreatedHandler(message: CaptureFeature) {
  try {
    console.log('received capture feature event message', message)
    await captureFeature(message)
  } catch (e) {
    console.error(e)
  }
}

async function rawCaptureCreatedHandler(message: RawCaptureFeature) {
  try {
    console.log('received raw capture event message', message)
    await rawCaptureFeature(message)
    console.log('raw capture event handler finished')
  } catch (e) {
    console.error(e)
  }
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
      SubscriptionNames.CAPTURE_CREATED,
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

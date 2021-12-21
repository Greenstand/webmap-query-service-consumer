import log from 'loglevel'
import { subscribe } from 'messaging/broker'
import { batchUpdate } from 'models/base'
import { addCaptureFeature, CaptureFeature } from 'models/captureFeature'
import {
  addRawCapture,
  assignRegion,
  updateCluster,
} from 'models/rawCaptureFeature'

import { TableNames } from '../db/knex'

async function captureFeatureCreatedHandler(message: CaptureFeature) {
  try {
    log.log('received capture feature event message', message)
    await addCaptureFeature(message)
  } catch (e) {
    log.error(e)
  }
}

async function rawCaptureCreatedHandler(message: CaptureFeature) {
  try {
    log.log('received raw capture event message', message)
    const rawCaptureFeature = { ...message }
    await addRawCapture(rawCaptureFeature)
    await assignRegion(rawCaptureFeature)
    await updateCluster(rawCaptureFeature)
    console.log('raw capture event handler finished')
  } catch (e) {
    log.error(e)
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
    log.log('token event handler received:', message)
    const { wallet_name, entries } = message
    const ids = entries.map((entry) => entry.capture_id)
    const updateObject = {
      wallet_name,
    }
    await batchUpdate(ids, updateObject, TableNames.CAPTURE_FEATURE)
    log.log('token event handler finished.')
  } catch (e) {
    log.error('Get error when handling message:', e)
  }
}

export default async function registerEventHandlers() {
  try {
    await subscribe('capture-created', captureFeatureCreatedHandler)
    await subscribe('raw-capture-created', rawCaptureCreatedHandler)
    await subscribe('token-assigned', tokenAssignedHandler)
  } catch (e) {
    log.error('Get error when handling message:', e)
  }
}

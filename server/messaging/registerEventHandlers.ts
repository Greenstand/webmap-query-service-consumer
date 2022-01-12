import onCaptureCreated from 'events/captureCreated'
import onRawCaptureCreated from 'events/rawCaptureCreated'
import onTokenAssigned from 'events/tokenAssigned'
import { subscribe } from 'messaging/broker'
import { SubscriptionNames } from './brokerConfig'

export default async function registerEventHandlers() {
  try {
    await subscribe(SubscriptionNames.CAPTURE_CREATED, onCaptureCreated)
    await subscribe(SubscriptionNames.RAW_CAPTURE_CREATED, onRawCaptureCreated)
    await subscribe(SubscriptionNames.TOKEN_ASSIGNED, onTokenAssigned)
  } catch (e) {
    console.error('Get error when handling message:', e)
  }
}

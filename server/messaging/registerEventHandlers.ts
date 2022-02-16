import onCaptureCreated from 'events/onCaptureCreated'
import onImpactProducerAssigned from 'events/onImpactProducerAssigned'
import onRawCaptureCreated from 'events/onRawCaptureCreated'
import onTokenAssigned from 'events/onTokenAssigned'
import { subscribe } from 'messaging/broker'
import { SubscriptionNames } from './brokerConfig'

export default async function registerEventHandlers() {
  await subscribe(SubscriptionNames.CAPTURE_CREATED, onCaptureCreated)
  await subscribe(SubscriptionNames.RAW_CAPTURE_CREATED, onRawCaptureCreated)
  await subscribe(SubscriptionNames.TOKEN_ASSIGNED, onTokenAssigned)
  await subscribe(
    SubscriptionNames.IMPACT_PRODUCER_ASSIGNED,
    onImpactProducerAssigned,
  )
}

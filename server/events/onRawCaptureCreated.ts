import { RawCaptureFeature } from 'interfaces/RawCaptureFeature'
import { SubscriptionNames } from 'messaging/brokerConfig'
import {
  addRawCapture,
  assignRawCaptureRegion,
  updateRawCaptureCluster,
} from 'models/rawCaptureFeature'

async function onRawCaptureCreated(data: RawCaptureFeature) {
  console.log(`${SubscriptionNames.RAW_CAPTURE_CREATED} message received`)
  await addRawCapture(data)
  await assignRawCaptureRegion(data)
  await updateRawCaptureCluster(data)
}
export default onRawCaptureCreated

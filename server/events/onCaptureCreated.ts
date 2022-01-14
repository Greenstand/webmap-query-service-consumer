import CaptureFeature from 'interfaces/CaptureFeature'
import { SubscriptionNames } from 'messaging/brokerConfig'
import {
  addCaptureFeature,
  assignCaptureFeatureRegion,
  updateCaptureCluster,
} from 'models/captureFeature'

async function onCaptureCreated(data: CaptureFeature) {
  console.log(`${SubscriptionNames.CAPTURE_CREATED} message received`)
  await addCaptureFeature(data)
  await assignCaptureFeatureRegion(data)
  await updateCaptureCluster(data)
}
export default onCaptureCreated

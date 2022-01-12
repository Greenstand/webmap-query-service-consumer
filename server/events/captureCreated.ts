import CaptureFeature from 'interfaces/CaptureFeature'
import {
  addCaptureFeature,
  assignCaptureFeatureRegion,
  updateCaptureCluster,
} from 'models/captureFeature'

async function onCaptureCreated(data: CaptureFeature) {
  await addCaptureFeature(data)
  await assignCaptureFeatureRegion(data)
  await updateCaptureCluster(data)
}
export default onCaptureCreated

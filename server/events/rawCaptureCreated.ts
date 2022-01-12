import { RawCaptureFeature } from 'interfaces/RawCaptureFeature'
import {
  addRawCapture,
  assignRawCaptureRegion,
  updateRawCaptureCluster,
} from 'models/rawCaptureFeature'

async function onRawCaptureCreated(data: RawCaptureFeature) {
  await addRawCapture(data)
  await assignRawCaptureRegion(data)
  await updateRawCaptureCluster(data)
}
export default onRawCaptureCreated

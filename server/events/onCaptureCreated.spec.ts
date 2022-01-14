import { SubscriptionNames } from 'messaging/brokerConfig'
import {
  addCaptureFeature,
  assignCaptureFeatureRegion,
  updateCaptureCluster,
} from 'models/captureFeature'
import data from '@test/mock/capture_in_kenya.json'
import onCaptureCreated from './onCaptureCreated'

jest.mock('models/captureFeature')

it(`should successfully handle ${SubscriptionNames.CAPTURE_CREATED} event`, async () => {
  await onCaptureCreated(data)
  expect(addCaptureFeature).toHaveBeenLastCalledWith(data)
  expect(assignCaptureFeatureRegion).toHaveBeenLastCalledWith(data)
  expect(updateCaptureCluster).toHaveBeenLastCalledWith(data)
})

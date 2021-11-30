import { CaptureFeatureRepository } from 'infra/database/pg-repositories'
import Session from 'infra/database/session'
import log from 'loglevel'
import { updateCaptureFeature } from 'models/capture-feature'

type TokenMessage = {
  entries: {
    capture_id: string
  }[]
  wallet_name: string
}

export default async function tokenAssignedHandler(message: TokenMessage) {
  try {
    log.warn('handler received:', message)

    const captureFeatureIds = message.entries.map((entry) => entry.capture_id)
    const captureFeatureUpdateObject = {
      wallet_name: message.wallet_name,
    }
    const dbSession = new Session()
    const captureFeatureRepo = new CaptureFeatureRepository(dbSession)

    const executeUpdateCaptureFeature = updateCaptureFeature(captureFeatureRepo)

    await executeUpdateCaptureFeature(
      captureFeatureIds,
      captureFeatureUpdateObject,
    )

    log.warn('handler finished.')
  } catch (e) {
    log.error('Get error when handling message:', e)
  }
}

const log = require('loglevel');
const {
  captureFeatureFromMessage,
  updateCaptureFeature,
} = require('../models/capture-feature.js');
const {
  CaptureFeatureRepository,
} = require('../infra/database/pg-repositories');
const Session = require('../infra/database/session.js');

const handler = async (message) => {
  try {
    log.warn('handler received:', message);
    const captureFeatureIds = message.entries.map((entry) => entry.capture_id);
    const captureFeatureUpdateObject = {
      wallet_name: message.wallet_name,
    };
    const dbSession = new Session();
    const captureFeatureRepo = new CaptureFeatureRepository(dbSession);
    const executeRawCreateCaptureFeature = updateCaptureFeature(
      captureFeatureRepo,
    );
    await executeRawCreateCaptureFeature(
      captureFeatureIds,
      captureFeatureUpdateObject,
    );
    log.warn('handler finished.');
  } catch (e) {
    log.error('Get error when handling message:', e);
  }
};

module.exports = handler;

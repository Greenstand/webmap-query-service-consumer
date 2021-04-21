const { captureFeatureFromMessage, createCaptureFeature } = require("../models/capture-feature.js");
const { CaptureFeatureRepository } = require('../infra/database/pg-repositories.js');
const { subscribe } = require('../infra/messaging/rabbit-mq-messaging');
const Session = require('../infra/database/session.js');

const createCaptureFeatureHandler = (async (message) => {
    const newCaptureFeature = captureFeatureFromMessage({ ...message });
    const dbSession = new Session();
    const captureFeatureRepo = new CaptureFeatureRepository(dbSession);
    captureFeatureRepo.add(newCaptureFeature);
});

const registerEventHandlers = () => {
  subscribe("capture-created", createCaptureFeatureHandler);
}

module.exports = registerEventHandlers;

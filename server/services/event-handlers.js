const { CaptureFeature, createCaptureFeature } = require("../models/capture-feature.js");
const { CaptureFeatureRepository } = require('../infra/database/pg-repositories.js');
const { subscribe } = require('../infra/messaging/rabbit-mq-messaging');
const Session = require('../infra/database/session.js');

const createCaptureFeatureHandler = (async (message) => {
    const newCaptureFeature = CaptureFeature(message);
    const session = new Session();
    const captureFeatureRepo = new CaptureFeatureRepository(session);
    
});

const registerEventHandlers = () => {
  subscribe("capture-created", createCaptureFeatureHandler);
}

module.exports = registerEventHandlers;


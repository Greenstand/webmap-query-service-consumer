const log = require("loglevel");
const { captureFeatureFromMessage, createCaptureFeature } = require("../models/capture-feature.js");
const { rawCaptureFeatureFromMessage, createRawCaptureFeature } = require("../models/raw-capture-feature.js");

const { CaptureFeatureRepository, RawCaptureFeatureRepository } = require('../infra/database/pg-repositories.js');
const { subscribe } = require('../infra/messaging/rabbit-mq-messaging');
const Session = require('../infra/database/session.js');
const tokenAssignedHandler = require("./event-token-assigned-handler.js");

const createCaptureFeatureHandler = (async (message) => {
  const newCaptureFeature = captureFeatureFromMessage({ ...message });
  const dbSession = new Session();
  const captureFeatureRepo = new CaptureFeatureRepository(dbSession);
  const executeCreateCaptureFeature = createCaptureFeature(captureFeatureRepo);
  executeCreateCaptureFeature.add(newCaptureFeature);
});

const createRawCaptureFeatureHandler = (async (message) => {
  try{
    log.warn("createRawCaptureFeatureHandler...", message);
    const newRawCaptureFeature = rawCaptureFeatureFromMessage({ ...message });
    const dbSession = new Session();
    const rawCaptureFeatureRepo = new RawCaptureFeatureRepository(dbSession);
    const executeRawCreateCaptureFeature = createRawCaptureFeature(rawCaptureFeatureRepo);
    await executeRawCreateCaptureFeature(newRawCaptureFeature);
  }catch(e){
    log.error("Get error when handling message:", e);
  }
})


const registerEventHandlers = () => {
  subscribe("capture-created", createCaptureFeatureHandler);
  subscribe("raw-capture-created", createRawCaptureFeatureHandler);
  subscribe("token-assigned", tokenAssignedHandler);
}

module.exports = registerEventHandlers;

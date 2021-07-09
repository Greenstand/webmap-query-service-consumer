const log = require("loglevel");
const { publish, subscribe} = require("../../server/infra/messaging/rabbit-mq-messaging");
const knex = require("../../server/infra/database/knex");
const {expect} = require("chai");
const registerEventHandlers = require('../../server/services/event-handlers.js');
const { unsubscribeAll } = require("../../server/infra/messaging/rabbit-mq-messaging");
const {v4} = require("uuid");
const capture = require("../mock/capture.json");

describe.only("rawCaptureFeature", () => {

  beforeEach(async () => {
    //load server
    registerEventHandlers();
    await knex("capture_feature").del();
    await knex("raw_capture_feature").del();
  });

  afterEach(async () => {
    await unsubscribeAll();
  });

  it("Successfully handle raw capture created event", async () => {
    const capture_id = "63e00bca-8eb0-11eb-8dcd-0242ac130003";
    const token_id = "9d7abad8-8eb0-11eb-8dcd-0242ac130003";
    //prepare the capture before the wallet event
    const message = capture; 
    publish("raw-capture-created", undefined, message, (e) => log.warn("result:", e));
    await new Promise(r => setTimeout(() => r(), 2000));
    const result = await knex("raw_capture_feature").select().where("id", capture_id);
    expect(result).lengthOf(1);
  });

});

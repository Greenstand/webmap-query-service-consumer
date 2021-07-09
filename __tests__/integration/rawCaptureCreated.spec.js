const log = require("loglevel");
const { publish, subscribe} = require("../../server/infra/messaging/rabbit-mq-messaging");
const knex = require("../../server/infra/database/knex");
const {expect} = require("chai");
const registerEventHandlers = require('../../server/services/event-handlers.js');
const { unsubscribeAll } = require("../../server/infra/messaging/rabbit-mq-messaging");
const {v4} = require("uuid");
const capture_in_kenya = require("../mock/capture_in_kenya.json");

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
    //prepare the capture before the wallet event
    const message = capture_in_kenya; 
    publish("raw-capture-created", undefined, message, (e) => log.warn("result:", e));
    await new Promise(r => setTimeout(() => r(), 2000));
    let result = await knex("raw_capture_feature").select().where("id", capture_in_kenya.id);
    expect(result).lengthOf(1);
    
    //check the region data, be sure the sample data has been imported from mock/xxx.copy
    result = await knex("region_assignment").select().where({
      map_feature_id: capture_in_kenya.id,
      zoom_level: 9,
      region_id: 2281072,
    });
    expect(result).lengthOf(1);
  });

});

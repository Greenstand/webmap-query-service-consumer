const { publish, subscribe} = require("../../server/infra/messaging/rabbit-mq-messaging");
const knex = require("../../server/infra/database/knex");
const {expect} = require("chai");
const registerEventHandlers = require('../../server/services/event-handlers.js');
const { unsubscribeAll } = require("../../server/infra/messaging/rabbit-mq-messaging");

describe("tokenAssigned", () => {

  beforeEach(async () => {
    //load server
    registerEventHandlers();
  });

  afterEach(async () => {
    await unsubscribeAll();
  });

  it.only("Successfully handle", async () => {
    const message = {
      "type": "TokensAssigned",
      "wallet_name": "joeswallet",
      "entries": [
        { "capture_id": "63e00bca-8eb0-11eb-8dcd-0242ac130003", "token_id": "9d7abad8-8eb0-11eb-8dcd-0242ac130003" },
        { "capture_id": "8533b704-8eb0-11eb-8dcd-0242ac130003", "token_id":"a5799d94-8eb0-11eb-8dcd-0242ac130003" } ]
    }
    publish("token-assigned", undefined, message, (e) => console.log("result:", e));
    await new Promise(r => setTimeout(() => r(), 2000));
    const result = await knex("capture_feature").select();
    expect(result).lengthOf(1);

  });

});

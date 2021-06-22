const knex = require("../../server/infra/database/knex");
const { publish, subscribe} = require("../../server/infra/messaging/rabbit-mq-messaging");

describe("db", () => {

  it("db", async  () => {
    await knex.select().table("capture_feature");
  });

});

describe("rabbit mq", () => {

  it("rabbit", done => {
    subscribe("capture-created", (e) => {
      console.warn("!received:", e);
      done();
    });
    publish("capture-created", undefined, {a:1}, (e) => console.log("result:", e));
  });

});

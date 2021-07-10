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
    await knex("region_assignment").del();
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
    
    //check the region data, make sure the sample data has been imported from mock/xxx.copy
    /*
     * the result from dev DB
     *
        treetracker_dev=> select DISTINCT ON (tree_id, zoom_level) trees.id as tree_id, zoom_level, region.id from (
        select id,lat,lon,estimated_geometric_location from trees where id = 928260
        ) trees
        join region
        ON ST_Contains( region.geom, trees.estimated_geometric_location)
        join region_zoom on region_zoom.region_id = region.id;
         tree_id | zoom_level |   id
        ---------+------------+---------
          928260 |          1 | 6632476
          928260 |          2 |   22905
          928260 |          3 | 6632611
          928260 |          4 | 6632476
          928260 |          5 | 6632476
          928260 |          6 |   22905
          928260 |          7 |   22905
          928260 |          8 |   22905
          928260 |          9 | 2281072
          928260 |         10 | 2281072
          928260 |         11 | 2281072
          928260 |         12 | 2281072
          928260 |         13 | 2281072
          928260 |         14 | 2281072
          928260 |         15 | 5447363
      (15 rows)
      */
    result = await knex("region_assignment").select().where({
      map_feature_id: capture_in_kenya.id,
      zoom_level: 9,
      region_id: 2281072,
    });
    expect(result).lengthOf(1);

    result = await knex("region_assignment").select().where({
      map_feature_id: capture_in_kenya.id,
    });
    log.warn("inserted:", result);
    expect(result).lengthOf(15);
  });

});

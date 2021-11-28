import knex from 'infra/database/knex'
import { publish } from 'infra/messaging/rabbit-mq-messaging'
import { unsubscribeAll } from 'infra/messaging/rabbit-mq-messaging'
import log from 'loglevel'
import registerEventHandlers from 'services/event-handlers'

import capture_in_kenya from '../mock/capture_in_kenya.json'

describe('rawCaptureFeature', () => {
  beforeEach(async () => {
    //load server
    registerEventHandlers()
    await knex('capture_feature').del()
    await knex('raw_capture_feature').del()
    await knex('region_assignment').del()
    await knex('raw_capture_cluster').del()
  })

  afterEach(async () => {
    await unsubscribeAll()
  })

  it('Successfully handle raw capture created event', async () => {
    //just care about the 14 zoom level
    const cluster_zoom_level = 14
    //prepare two clusters, the new capture will find the nearest to update
    await knex('raw_capture_cluster').insert({
      zoom_level: cluster_zoom_level,
      location: `POINT(${capture_in_kenya.lon + 1} ${capture_in_kenya.lat})`,
      count: 1,
    })

    //a farther cluster
    await knex('raw_capture_cluster').insert({
      zoom_level: cluster_zoom_level,
      location: `POINT(${capture_in_kenya.lon + 2} ${capture_in_kenya.lat})`,
      count: 5,
    })

    //prepare the capture before the wallet event
    const message = capture_in_kenya
    publish('raw-capture-created', '', message, (e) => log.warn('result:', e))
    await new Promise((r) => setTimeout(() => r(''), 2000))
    let result = await knex('raw_capture_feature')
      .select()
      .where('id', capture_in_kenya.id)
    expect(result).toHaveLength(1)

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
    result = await knex('region_assignment').select().where({
      map_feature_id: capture_in_kenya.id,
      zoom_level: 9,
      region_id: 2281072,
    })
    expect(result).toHaveLength(1)

    result = await knex('region_assignment').select().where({
      map_feature_id: capture_in_kenya.id,
    })
    log.warn('inserted:', result)
    expect(result).toHaveLength(15)

    //the cluster closer should be updated, and it's count is 2 now
    result = await knex('raw_capture_cluster').select().where({
      count: 2,
    })
    log.warn('cluster:', result)
    expect(result).toHaveLength(1)
  })
})

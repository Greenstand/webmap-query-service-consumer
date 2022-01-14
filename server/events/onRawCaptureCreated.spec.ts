import { SubscriptionNames } from 'messaging/brokerConfig'
import {
  addRawCapture,
  assignRawCaptureRegion,
  updateRawCaptureCluster,
} from 'models/rawCaptureFeature'
import data from '@test/mock/capture_in_kenya.json'
import onRawCaptureCreated from './onRawCaptureCreated'

jest.mock('models/rawCaptureFeature')

it(`should successfully handle ${SubscriptionNames.RAW_CAPTURE_CREATED} event`, async () => {
  await onRawCaptureCreated(data)
  expect(addRawCapture).toHaveBeenLastCalledWith(data)
  expect(assignRawCaptureRegion).toHaveBeenLastCalledWith(data)
  expect(updateRawCaptureCluster).toHaveBeenLastCalledWith(data)
})

// check the region data, make sure the sample data has been imported from mock/xxx.copy
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

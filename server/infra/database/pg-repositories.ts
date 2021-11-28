import log from 'loglevel'
import { Message } from 'models/capture-feature'
import { RawCapture } from 'models/raw-capture-feature'

import BaseRepository from './BaseRepository'
import Session from './session'

export class CaptureFeatureRepository extends BaseRepository {
  constructor(session:Session) {
    super('capture_feature', session);
    this.tableName = 'capture_feature';
    this.session = session;
  }

  async add(captureFeature:Message) {
    // Since the query uses postgres function ST_PointFromText, knex's raw function is used
    const wellKnownText = `POINT(${captureFeature.lon} ${captureFeature.lat})`;
    const result = await this.session.getDB().raw(
      `insert into map_features.capture_feature (
             id, lat, lon, location, field_user_id, field_username, 
             device_identifier, attributes, species_name, created_at, updated_at) 
             values(?, ?, ?, ?, ST_PointFromText(?, 4326), ?, ?, ?, ?, ?, ?, ?)
             returning id`,
      [
        captureFeature.id,
        captureFeature.lat,
        captureFeature.lon,
        wellKnownText,
        captureFeature.field_user_id,
        captureFeature.field_username,
        captureFeature.device_identifier,
        captureFeature.attributes,
        captureFeature.species_name,
        captureFeature.created_at,
        captureFeature.created_at,
      ],
    );
    return result.rows[0];
  }

  async batchUpdate<T>(captureIds: string[], updateObject: T) {
    log.warn('batchUpdate');
    const objectCopy = {...updateObject }as Omit<T, 'id'>;
    const result = await this.session
      .getDB()(this.tableName)
      .update(objectCopy)
      .whereIn('id', captureIds);
    log.warn('result of update:', result);
  }
}

export class RawCaptureFeatureRepository extends BaseRepository {
  constructor(session:Session) {
    super('raw_capture_feature', session);
    this.tableName = 'raw_capture_feature';
    this.session = session;
  }

  async add(rawCaptureFeature: RawCapture) {
    log.warn(this.tableName, ' add:', rawCaptureFeature);
    const wellKnownText = `POINT(${rawCaptureFeature.lon} ${rawCaptureFeature.lat})`;
    const result = await this.session.getDB().raw(
      `insert into map_features.raw_capture_feature (
             id, lat, lon, location, field_user_id, field_username, 
             device_identifier, attributes, created_at, updated_at) 
             values(?, ?, ?, ST_PointFromText(?, 4326), ?, ?, ?, ?, ?, ?)
             returning id`
						 ,
      [
        rawCaptureFeature.id,
        rawCaptureFeature.lat,
        rawCaptureFeature.lon,
        wellKnownText,
        rawCaptureFeature.field_user_id,
        rawCaptureFeature.field_username,
        rawCaptureFeature.device_identifier,
        rawCaptureFeature.attributes,
        rawCaptureFeature.created_at,
        rawCaptureFeature.created_at,
      ]
    );

    return result.rows[0];
  }

  async assignRegion(rawCaptureFeature:RawCapture) {
    log.warn(this.tableName, ' assign region:', rawCaptureFeature);
    const result = await this.session.getDB().raw(
      `
      INSERT INTO region_assignment
        (map_feature_id, zoom_level, region_id)
        SELECT DISTINCT ON (captures.id, zoom_level) captures.id AS map_feature_id, zoom_level, region.id
        FROM (
            SELECT *
            FROM raw_capture_feature
            WHERE id = ?
        ) captures
        JOIN region
        ON ST_Contains( region.geom, ST_SetSRID(ST_Point(?, ?), 4326))
        JOIN region_zoom
        ON region_zoom.region_id = region.id
        ORDER BY captures.id, zoom_level, region_zoom.priority DESC
    `,
      [rawCaptureFeature.id, rawCaptureFeature.lon, rawCaptureFeature.lat],
    );
    log.warn(this.tableName, 'inserted:', result);
    return true;
  }

  /*
   * To update the count of cluster
   * https://github.com/Greenstand/treetracker-web-map-api/blob/e8c8abc0c6b07841e0ba69f0826eead69315342c/src/cron/assign-new-trees-to-clusters.js#L106-L128
   * For performance, just update the count that this capture belongs to, so just find the nearest cluster and add +1, we still need a periodically task to refresh these cluster
   */
  async updateCluster(rawCaptureFeature:RawCapture) {
    log.warn(this.tableName, ' updateCluster');

    const result = await this.session.getDB().raw(
      `
      UPDATE raw_capture_cluster 
      SET count = count + 1 
      WHERE id = (
        SELECT id FROM 
          (SELECT id, count, ST_Distance(location, ST_SetSRID(ST_Point(?, ?), 4326)) AS dis 
          FROM raw_capture_cluster 
          ORDER BY dis 
          LIMIT 1) dissql
      )
      `,
      [rawCaptureFeature.lon, rawCaptureFeature.lat],
    );
    log.warn(this.tableName, ' updated:', result);
  }
}


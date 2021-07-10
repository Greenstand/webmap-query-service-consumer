const BaseRepository = require("./BaseRepository");
const log = require("loglevel");

class CaptureFeatureRepository extends BaseRepository {
    constructor(session) {
        super("capture_feature", session);
        this._tableName = "capture_feature";
        this._session = session;
    }

    async add(captureFeature) {
        // Since the query uses postgres function ST_PointFromText, knex's raw function is used
        const wellKnownText = `POINT(${captureFeature.lon} ${captureFeature.lat})`;
        const result = await this._session.getDB().raw(`insert into map_features.capture_feature (
             id, lat, lon, location, field_user_id, field_username, 
             device_identifier, attributes, species_name, created_at, updated_at) 
             values(?, ?, ?, ?, ST_PointFromText(?, 4326), ?, ?, ?, ?, ?, ?, ?)
             returning id`,
            [captureFeature.id, captureFeature.lat, captureFeature.lon, wellKnownText,
            captureFeature.field_user_id, captureFeature.field_username, captureFeature.device_identifier,
            captureFeature.attributes, captureFeature.species_name, captureFeature.created_at, captureFeature.created_at]);
        return result.rows[0];
    }

  async batchUpdate(captureIds, updateObject){
    log.warn("batchUpdate");
    const objectCopy = {};
    Object.assign(objectCopy, updateObject)
    delete objectCopy.id
    const result = await this._session.getDB()(this._tableName).update(objectCopy).whereIn("id", captureIds);
    log.warn("result of update:", result);
  }

}

class RawCaptureFeatureRepository extends BaseRepository {

  constructor(session) {
    super("raw_capture_feature", session);
    this._tableName = "raw_capture_feature";
    this._session = session;
  }

  async add(rawCaptureFeature) {
    log.warn(this._tableName, " add:", rawCaptureFeature);
    const wellKnownText = `POINT(${rawCaptureFeature.lon} ${rawCaptureFeature.lat})`;
    const result = await this._session.getDB().raw(`insert into raw_capture_feature (
             id, lat, lon, location, field_user_id, field_username, 
             device_identifier, attributes, created_at, updated_at) 
             values(?, ?, ?, ST_PointFromText(?, 4326), ?, ?, ?, ?, ?, ?)
             returning id`,
      [rawCaptureFeature.id, rawCaptureFeature.lat, rawCaptureFeature.lon, wellKnownText,
        rawCaptureFeature.field_user_id, rawCaptureFeature.field_username, rawCaptureFeature.device_identifier,
        rawCaptureFeature.attributes, rawCaptureFeature.created_at, rawCaptureFeature.created_at]);
    
    return result.rows[0]; 
  }
    
  async assignRegion(rawCaptureFeature){
    log.warn(this._tableName, " assign region:", rawCaptureFeature);
    const result = await this._session.getDB().raw(`
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
      [
        rawCaptureFeature.id, 
        rawCaptureFeature.lon, 
        rawCaptureFeature.lat, 
      ]
    );
    log.warn(this._tableName, "inserted:", result);
    return true;
  }

  /*
   * To update the count of cluster 
   * https://github.com/Greenstand/treetracker-web-map-api/blob/e8c8abc0c6b07841e0ba69f0826eead69315342c/src/cron/assign-new-trees-to-clusters.js#L106-L128
   * For performance, just update the count that this capture belongs to, so just find the nearest cluster and add +1, we still need a periodically task to refresh these cluster
   */
  async updateCluster(rawCaptureFeature){
    log.warn(this._tableName, " updateCluster");

    const result = await this._session.getDB().raw(`
      UPDATE raw_capture_cluster 
      SET count = count + 1 
      WHERE id = (
        SELECT id FROM 
          (SELECT id, count, ST_Distance(location, ST_SetSRID(ST_Point(?, ?), 4326)) AS dis 
          FROM raw_capture_cluster 
          ORDER BY dis 
          LIMIT 1) dissql
      )
      `,[
        rawCaptureFeature.lon,
        rawCaptureFeature.lat,
      ]
    );
    log.warn(this._tableName, " updated:", result);
  }
    
}

module.exports = { CaptureFeatureRepository, RawCaptureFeatureRepository }

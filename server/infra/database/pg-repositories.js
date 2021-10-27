const BaseRepository = require('./BaseRepository');
const log = require('loglevel');

class CaptureFeatureRepository extends BaseRepository {
  constructor(session) {
    super('capture_feature', session);
    this._tableName = 'capture_feature';
    this._session = session;
  }

  async add(captureFeature) {
    // Since the query uses postgres function ST_PointFromText, knex's raw function is used
    const wellKnownText = `POINT(${captureFeature.lon} ${captureFeature.lat})`;
    const result = await this._session.getDB().raw(
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

  async batchUpdate(captureIds, updateObject) {
    log.warn('batchUpdate');
    const objectCopy = {};
    Object.assign(objectCopy, updateObject);
    delete objectCopy.id;
    const result = await this._session
      .getDB()(this._tableName)
      .update(objectCopy)
      .whereIn('id', captureIds);
    log.warn('result of update:', result);
  }
}

class RawCaptureFeatureRepository extends BaseRepository {
  constructor(session) {
    super('raw_capture_feature', session);
    this._tableName = 'raw_capture_feature';
    this._session = session;
  }

  async add(rawCaptureFeature) {
    const wellKnownText = `POINT(${rawCaptureFeature.lon} ${rawCaptureFeature.lat})`;
    const result = await this._session.getDB().raw(
      `insert into map_features.raw_capture_feature (
             id, lat, lon, location, field_user_id, field_username, 
             device_identifier, attributes, created_at, updated_at) 
             values(?, ?, ?, ST_PointFromText(?, 4326), ?, ?, ?, ?, ?, ?)
             returning id`,
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
      ],
    );
    return result.rows[0];
  }
}

module.exports = { CaptureFeatureRepository, RawCaptureFeatureRepository };

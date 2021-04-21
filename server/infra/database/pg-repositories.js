const BaseRepository = require("./BaseRepository");

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
             id, image_url, lat, lon, location, field_user_id, field_username, 
             device_identifier, attributes, species_name, created_at, updated_at) 
             values(?, ?, ?, ?, ST_PointFromText(?, 4326), ?, ?, ?, ?, ?, ?, ?)
             returning id`,
            [captureFeature.id, captureFeature.image_url, captureFeature.lat, captureFeature.lon, wellKnownText,
            captureFeature.field_user_id, captureFeature.field_username, captureFeature.device_identifier,
            captureFeature.attributes, captureFeature.species_name, captureFeature.created_at, captureFeature.created_at]);
        return result.rows[0];
    }
}

module.exports = { CaptureFeatureRepository }
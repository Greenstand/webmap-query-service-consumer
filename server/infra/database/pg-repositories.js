const BaseRepository = require("./BaseRepository");

class CaptureFeatureRepository extends BaseRepository {
    constructor(session) {
        super("raw_capture", session);
        this._tableName = "raw_capture";
        this._session = session;
    }

    async add(captureFeature) {
        return await super.create(captureFeature);
    }

}

module.exports = { CaptureFeatureRepository }
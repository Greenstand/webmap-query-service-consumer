import log from 'loglevel'
import { CaptureFeature } from 'models/capture-feature'

import BaseRepository from './BaseRepository'
import Session from './session'

export default class CaptureFeatureRepository extends BaseRepository {
  constructor(session: Session) {
    super('capture_feature', session)
    this.tableName = 'capture_feature'
    this.session = session
  }

  async add(captureFeature: CaptureFeature) {
    // Since the query uses postgres function ST_PointFromText, knex's raw function is used
    const wellKnownText = `POINT(${captureFeature.lon} ${captureFeature.lat})`
    const result = await this.session.getDB().raw(
      `insert into capture_feature (
             id, lat, lon, location, field_user_id, field_username, 
             device_identifier, attributes, created_at, updated_at) 
             values(?, ?, ?, ST_PointFromText(?, 4326), ?, ?, ?, ?, ?, ?)
             returning id`,
      [
        captureFeature.id,
        captureFeature.lat,
        captureFeature.lon,
        wellKnownText,
        captureFeature.field_user_id,
        captureFeature.field_username,
        captureFeature.device_identifier,
        JSON.stringify(captureFeature.attributes),
        captureFeature.created_at,
        captureFeature.created_at,
      ],
    )
    return result.rows[0]
  }

  async batchUpdate<T>(captureIds: string[], updateObject: T) {
    log.warn('batchUpdate: ', updateObject)
    const objectCopy = { ...updateObject } as Omit<T, 'id'>
    const result = await this.session
      .getDB()(this.tableName)
      .update(objectCopy)
      .whereIn('id', captureIds)
    log.warn('result of update:', result)
  }
}

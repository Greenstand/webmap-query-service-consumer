import { RawCaptureFeature } from 'models/raw-capture-feature'

import BaseRepository from './BaseRepository'
import knex from './knex'
import Session from './session'

export async function addRawCapture(rawCaptureFeature: RawCaptureFeature) {
  const wellKnownText = `POINT(${rawCaptureFeature.lon} ${rawCaptureFeature.lat})`
  const result = await knex.raw(
    `insert into raw_capture_feature (
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
      JSON.stringify(rawCaptureFeature.attributes),
      rawCaptureFeature.created_at,
      rawCaptureFeature.created_at,
    ],
  )
  return result.rows[0]
}

export async function assignRegion(rawCaptureFeature: RawCaptureFeature) {
  const res = await knex.raw(
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
  )
  console.log('assign region result: ', res)
  return true
}

export async function updateCluster(rawCaptureFeature: RawCaptureFeature) {
  await knex.raw(
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
  )
}

export default class RawCaptureFeatureRepository extends BaseRepository {
  constructor(session: Session) {
    super('raw_capture_feature', session)
    this.tableName = 'raw_capture_feature'
    this.session = session
  }

  async add(rawCaptureFeature: RawCaptureFeature) {
    const wellKnownText = `POINT(${rawCaptureFeature.lon} ${rawCaptureFeature.lat})`
    const result = await this.session.getDB().raw(
      `insert into raw_capture_feature (
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
        JSON.stringify(rawCaptureFeature.attributes),
        rawCaptureFeature.created_at,
        rawCaptureFeature.created_at,
      ],
    )
    return result.rows[0]
  }

  async assignRegion(rawCaptureFeature: RawCaptureFeature) {
    const res = await this.session.getDB().raw(
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
    )
    console.log('assign region result: ', res)
    return true
  }

  /*
   * To update the count of cluster
   * https://github.com/Greenstand/treetracker-web-map-api/blob/e8c8abc0c6b07841e0ba69f0826eead69315342c/src/cron/assign-new-trees-to-clusters.js#L106-L128
   * For performance, just update the count that this capture belongs to, so just find the nearest cluster and add +1, we still need a periodically task to refresh these cluster
   */

  async updateCluster(rawCaptureFeature: RawCaptureFeature) {
    await this.session.getDB().raw(
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
    )
  }
}

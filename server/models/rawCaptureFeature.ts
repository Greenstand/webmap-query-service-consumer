import knex from 'db/knex'

import { Attribute } from './captureFeature'

export type RawCaptureFeature = {
  id: number | string
  lat: number
  lon: number
  field_user_id: number | string
  field_username: string
  attributes: Attribute[]
  device_identifier: string | number
  created_at: string
  updated_at: string
}

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

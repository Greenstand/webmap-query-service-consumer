import knex from 'db/knex'
import CaptureFeature from 'interfaces/CaptureFeature'

export async function addCaptureFeature(
  data: CaptureFeature,
): Promise<{ id: string } | undefined> {
  // Since the query uses postgres function ST_PointFromText, knex's raw function is used
  const wellKnownText = `POINT(${data.lon} ${data.lat})`
  const result = await knex.raw(
    `insert into capture_feature (
             id, lat, lon, location, field_user_id, field_username, 
             device_identifier, attributes, created_at, updated_at, map) 
             values(?, ?, ?, ST_PointFromText(?, 4326), ?, ?, ?, ?, ?, ?, ?)
             returning id`,
    [
      data.id,
      data.lat,
      data.lon,
      wellKnownText,
      data.field_user_id,
      data.field_username,
      data.device_identifier,
      JSON.stringify(data.attributes),
      data.created_at,
      data.created_at,
      JSON.stringify(data.map),
    ],
  )
  return result.rows[0]
}

export async function assignCaptureFeatureRegion(data: CaptureFeature) {
  await knex.raw(
    `
      INSERT INTO region_assignment
        (map_feature_id, zoom_level, region_id)
        SELECT DISTINCT ON (captures.id, zoom_level) captures.id AS map_feature_id, zoom_level, region.id
        FROM (
            SELECT *
            FROM capture_feature
            WHERE id = ?
        ) captures
        JOIN region
        ON ST_Contains( region.geom, ST_SetSRID(ST_Point(?, ?), 4326))
        JOIN region_zoom
        ON region_zoom.region_id = region.id
        ORDER BY captures.id, zoom_level, region_zoom.priority DESC
    `,
    [data.id, data.lon, data.lat],
  )
}

export async function updateCaptureCluster(data: CaptureFeature) {
  const res = await knex.raw(
    `
      UPDATE capture_cluster 
      SET count = count + 1 
      WHERE id = (
        SELECT id FROM 
          (SELECT id, count, ST_Distance(location, ST_SetSRID(ST_Point(?, ?), 4326)) AS dis 
          FROM capture_cluster 
          ORDER BY dis 
          LIMIT 1) dissql
      )
      `,
    [data.lon, data.lat],
  )
  return res
}

import knex, { TableNames } from 'db/knex'
import { RawCaptureFeature } from 'interfaces/RawCaptureFeature'

// update objects by ids on tableName with updateObject
export async function batchUpdate<T>(
  ids: string[],
  updateObject: T,
  tableName: TableNames,
) {
  // remove id from updateObject
  const objectCopy = { ...updateObject } as Omit<T, 'id'>
  const result = await knex(tableName).update(objectCopy).whereIn('id', ids)
  return result
}

// update objects by ids on tableName with updateObject
export async function getFeatureById<T>(
  table: TableNames,
  id: string,
): Promise<T> {
  const result = await knex(table).select().where('id', id)
  return result[0]
}

// update objects by ids on tableName with updateObject
export async function updateImpactProducer(
  tableName: TableNames,
  id: string,
  newImpactProducer: string,
) {
  const feature: RawCaptureFeature = await getFeatureById(tableName, id)
  if (!feature) return console.error('feature with id not found')
  const updateObject = {
    ...feature,
    map: { ...feature.map, impact_producer: newImpactProducer },
  }

  const result = await batchUpdate([id], updateObject, tableName)
  return result
}

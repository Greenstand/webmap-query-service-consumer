import knex, { TableNames } from 'db/knex'

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

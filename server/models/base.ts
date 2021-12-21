import knex, { TableNames } from 'db/knex'
import { log } from 'loglevel'

export async function batchUpdate<T>(
  ids: string[],
  updateObject: T,
  tableName: TableNames,
) {
  log('batchUpdate: ', updateObject)
  const objectCopy = { ...updateObject } as Omit<T, 'id'>
  const result = await knex(tableName).update(objectCopy).whereIn('id', ids)
  log('result of update:', result)
}

export function truncateTables(tables: TableNames[]) {
  return Promise.all(
    tables.map((table) => knex.raw('truncate table ' + table + ' cascade')),
  )
}

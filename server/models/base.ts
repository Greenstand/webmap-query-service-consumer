import knex, { TableNames } from 'db/knex'

export async function batchUpdate<T>(
  ids: string[],
  updateObject: T,
  tableName: TableNames,
) {
  console.log('batchUpdate: ', updateObject)
  const objectCopy = { ...updateObject } as Omit<T, 'id'>
  const result = await knex(tableName).update(objectCopy).whereIn('id', ids)
  console.log('result of update:', result)
}

export function truncateTables(tables: TableNames[]) {
  return Promise.all(
    tables.map((table) => knex.raw('truncate table ' + table + ' cascade')),
  )
}

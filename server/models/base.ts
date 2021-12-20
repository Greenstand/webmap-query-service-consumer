import { log } from 'loglevel'
import { CaptureFeature } from 'models/captureFeature'
import knex, { TableNames } from 'services/knex'

export async function batchUpdate(
  ids: string[],
  updateObject: Partial<CaptureFeature>,
  tableName: TableNames.CAPTURE_FEATURE,
): Promise<void>

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

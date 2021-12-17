import knex from 'infra/database/knex'
import { log } from 'loglevel'
import { CaptureFeature } from 'models/capture-feature'

export type TableName = 'capture_feature'

export async function batchUpdate(
  ids: string[],
  updateObject: Partial<CaptureFeature>,
  tableName: 'capture_feature',
): Promise<void>

export async function batchUpdate<T>(
  ids: string[],
  updateObject: T,
  tableName: TableName,
) {
  log('batchUpdate: ', updateObject)
  const objectCopy = { ...updateObject } as Omit<T, 'id'>
  const result = await knex(tableName).update(objectCopy).whereIn('id', ids)
  log('result of update:', result)
}

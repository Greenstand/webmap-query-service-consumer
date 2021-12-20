import { log } from 'loglevel'
import { CaptureFeature } from 'models/captureFeature'
import knex from 'services/knex'

export enum TableNames {
  CAPTURE_FEATURE = 'capture_feature',
  RAW_CAPTURE_FEATRURE = 'raw_capture_feature',
  RAW_CAPTURE_CLUSTER = 'raw_capture_cluster',
  REGION_ASSIGNMENT = 'region_assignment',
}

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

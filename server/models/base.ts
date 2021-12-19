import { log } from 'loglevel'
import { CaptureFeature } from 'models/captureFeature'
import knex from 'services/knex'

export enum TableName {
  CaptureFeature = 'capture_feature',
  RawCaptureFeature = 'raw_capture_feature',
  RegionAssignment = 'region_assignment',
}

export async function batchUpdate(
  ids: string[],
  updateObject: Partial<CaptureFeature>,
  tableName: TableName.CaptureFeature,
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

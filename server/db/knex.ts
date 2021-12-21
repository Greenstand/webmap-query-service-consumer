import { Global } from 'interfaces/global'
import { knex as initKnex } from 'knex'

import knexConfig from './knexConfig'

export enum TableNames {
  CAPTURE_FEATURE = 'capture_feature',
  RAW_CAPTURE_FEATRURE = 'raw_capture_feature',
  RAW_CAPTURE_CLUSTER = 'raw_capture_cluster',
  REGION_ASSIGNMENT = 'region_assignment',
}

function connectToDb() {
  console.log('connecting to db')
  const connection = initKnex(knexConfig)
  ;(global as Global).__DB_CONNECTION = connection
  return connection
}

function getDbConnection() {
  return (global as Global).__DB_CONNECTION ?? connectToDb()
}

const knex = getDbConnection()
export default knex

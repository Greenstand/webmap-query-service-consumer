import { Knex } from 'knex'
import { BrokerAsPromised } from 'rascal'

export type Global = {
  dbConnection?: Knex
  broker?: BrokerAsPromised
}

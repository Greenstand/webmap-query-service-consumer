import { Knex } from 'knex'
import { BrokerAsPromised } from 'rascal'

export type Global = {
  __DB_CONNECTION?: Knex<any, unknown[]>
  __BROKER?: BrokerAsPromised
}

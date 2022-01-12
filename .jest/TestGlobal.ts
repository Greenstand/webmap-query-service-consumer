import { BrokerAsPromised } from 'rascal'
import { Global } from 'interfaces/Global'

export type TestGlobal = Global & {
  publisher?: BrokerAsPromised
}

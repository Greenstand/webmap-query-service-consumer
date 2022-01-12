import { Global } from 'interfaces/Global'
import { BrokerAsPromised } from 'rascal'

export type TestGlobal = Global & {
  publisher?: BrokerAsPromised
}

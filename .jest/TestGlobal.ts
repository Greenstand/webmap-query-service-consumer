import { BrokerAsPromised } from 'rascal'
import { Global } from 'interfaces/Global'

type TestGlobal = Global & {
  publisher?: BrokerAsPromised
}
export default TestGlobal

import { config as dotEnvConfig } from 'dotenv'
dotEnvConfig()
// set up log level
import './setup'

import { initBroker } from 'messaging/broker'

import registerEventHandlers from './services/eventHandlers'

async function main() {
  const broker = await initBroker()
  await registerEventHandlers(broker)
}

main()
  .then(() => {
    console.log('server is listening...')
  })
  .catch((err) => {
    console.error(err)
  })

import log from 'loglevel'
import { initBroker } from 'messaging/broker'

import registerEventHandlers from './services/eventHandlers'

async function main() {
  if (process.env.NODE_LOG_LEVEL) {
    log.setDefaultLevel(process.env.NODE_LOG_LEVEL as log.LogLevelDesc)
  } else {
    log.setDefaultLevel('info')
  }
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

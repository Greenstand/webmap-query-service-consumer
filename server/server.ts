import { error, log } from 'loglevel'
import { initBroker } from 'messaging/broker'
import { setupLoglevel } from 'utils/log'

import registerEventHandlers from './services/eventHandlers'

async function main() {
  setupLoglevel()
  log('registering event handlers')
  const broker = await initBroker()
  await registerEventHandlers(broker)
}

main()
  .then(() => {
    log('server is listening...')
  })
  .catch((err) => {
    error(err)
  })

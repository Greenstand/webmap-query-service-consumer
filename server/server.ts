import log from 'loglevel'
import { setupLoglevel } from 'utils/log'

import registerEventHandlers from './messaging/eventHandlers'

async function main() {
  setupLoglevel()
  log.log('registering event handlers')
  await registerEventHandlers()
}

main()
  .then(() => {
    log.log('server is listening...')
  })
  .catch((err) => {
    log.error(err)
  })

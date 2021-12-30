import { setupLoglevel } from 'utils/log'

import registerEventHandlers from './messaging/eventHandlers'

async function main() {
  setupLoglevel()
  console.log('registering event handlers')
  await registerEventHandlers()
}

main()
  .then(() => {
    console.log('server is listening...')
  })
  .catch((err) => {
    console.error(err)
  })

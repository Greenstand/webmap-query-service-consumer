import { setupLoglevel } from 'utils/log'
import registerEventHandlers from './messaging/registerEventHandlers'

async function main() {
  setupLoglevel()
  console.info('registering event handlers')
  await registerEventHandlers()
}

main()
  .then(() => {
    console.info('server is listening...')
  })
  .catch((err) => {
    console.error(err)
  })

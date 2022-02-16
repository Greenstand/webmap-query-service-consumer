import knex from 'db/knex'
import { teardownBroker } from 'messaging/broker'
import { setupLoglevel } from 'utils/log'
import registerEventHandlers from './messaging/registerEventHandlers'

async function main() {
  setupLoglevel()
  console.info('registering event handlers')
  await registerEventHandlers()
}

main()
  .then(() => {
    console.info('server is listening to events')
  })
  .catch((err) => {
    console.error(err)
  })

process.once('SIGINT', async () => {
  console.info('Terminate request received...')
  console.info('destroying db connection')
  await knex.destroy()
  console.info('shutting down RabbitMQ broker')
  await teardownBroker()
  console.info('server teardown complete')
})

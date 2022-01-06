import knex from 'db/knex'
import { handleBrokers } from './utils'

afterEach(async () => {
  await handleBrokers((broker) => broker.purge())
})

afterAll(async () => {
  await Promise.all([
    knex.destroy(), //
    handleBrokers((broker) => broker.nuke()),
  ])
})

import knex from 'db/knex'
import { handleBrokers } from './utils'

afterAll(async () => {
  await Promise.all([
    knex.destroy(), //
    await handleBrokers(async (broker) => {
      await broker.unsubscribeAll()
      await broker.purge()
      await broker.shutdown()
    }),
  ])
})

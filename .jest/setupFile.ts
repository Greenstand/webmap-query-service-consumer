import knex from '../server/services/knex'

afterAll(async () => {
  await knex.destroy()
})

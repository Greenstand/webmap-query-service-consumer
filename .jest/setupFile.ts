import knex from 'db/knex'

afterAll(async () => {
  await knex.destroy()
})

import { rest } from 'msw'
import { setupServer, SetupServerApi } from 'msw/node'
import knex from 'db/knex'
import data from '@test/mock/stakeholder.json'
import { destroyPublisher } from './publisher'

const stakeholderApiRoute = process.env.STAKEHOLDER_API_ROUTE ?? ''

let mockServer: SetupServerApi

beforeAll(() => {
  const route = `${stakeholderApiRoute}/:id`
  mockServer = setupServer(
    rest.get(route, (req, res, ctx) =>
      res(
        ctx.status(202, 'Mocked status'),
        ctx.json({
          ...data,
        }),
      ),
    ),
  )
  mockServer.listen()
})

afterAll(async () => {
  mockServer.close()
  await Promise.all([
    knex.destroy(), //
    await destroyPublisher(),
  ])
})

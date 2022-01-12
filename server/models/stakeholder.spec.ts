import { rest } from 'msw'
import { setupServer } from 'msw/node'
import data from '@test/mock/stakeholder.json'
import { getStakeholderMap } from './stakeholder'

const stakeholderApiRoute = process.env.STAKEHOLDER_API_ROUTE ?? ''

beforeAll(() => {
  const route = `${stakeholderApiRoute}/:id`
  console.log('route:', route)

  const mockServer = setupServer(
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

it('should get map name from stakeholder api', async () => {
  const stakeholderId = data.id
  const map = await getStakeholderMap(stakeholderId)
  expect(map).toBe(data.map)
})

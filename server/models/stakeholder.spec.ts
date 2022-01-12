import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { getStakeholderMap } from './stakeholder'

const stakeholderApiRoute = process.env.STAKEHOLDER_API_ROUTE ?? ''

beforeAll(() => {
  // 2. Define request handlers and response resolvers.
  const route = `${stakeholderApiRoute}/:id`
  console.log('route:', route)

  const worker = setupServer(
    rest.get(route, (req, res, ctx) =>
      res(
        ctx.status(202, 'Mocked status'),
        ctx.json({
          map: 'Mocked response JSON body',
        }),
      ),
    ),
  )

  // 3. Start the Service Worker.
  worker.listen()
})

it('should get map name from stakeholder api', async () => {
  const stakeholderId = '1'
  const map = await getStakeholderMap(stakeholderId)
  expect(map)
})

import { rest } from 'msw'
import { setupServer } from 'msw/node'
import data from '@test/mock/stakeholder.json'

const stakeholderApiRoute = process.env.STAKEHOLDER_API_ROUTE ?? ''

export function createStakeholderApi() {
  const route = `${stakeholderApiRoute}/:id`
  return setupServer(
    rest.get(route, (req, res, ctx) =>
      res(
        ctx.status(202, 'Mocked status'),
        ctx.json({
          ...data,
        }),
      ),
    ),
  )
}

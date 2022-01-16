import { rest } from 'msw'
import { setupServer } from 'msw/node'
import data from '@test/mock/stakeholder.json'

const stakeholderApiRoute = process.env.STAKEHOLDER_API_ROUTE ?? ''

export default function createStakeholderApi() {
  return setupServer(
    rest.get(stakeholderApiRoute, (req, res, ctx) =>
      res(
        ctx.status(200, 'Mock success'),
        ctx.json({
          ...data,
          id: req.url.searchParams.get('stakeholder_id'),
        }),
      ),
    ),
  )
}

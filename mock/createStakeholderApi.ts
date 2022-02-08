import data from '@mock/stakeholder.json'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.get('*/stakeholder', (req, res, ctx) =>
    res(
      ctx.status(200, 'Mock success'),
      ctx.json({
        ...data,
        id: req.url.searchParams.get('stakeholder_id'),
      }),
    ),
  ),
)

export default server

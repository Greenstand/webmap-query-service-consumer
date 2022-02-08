import data from '@mock/stakeholder.json'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.get('*/stakeholder', (req, res, ctx) => {
    const id = req.url.searchParams.get('stakeholder_id')
    if (!id) return res(ctx.status(500))
    return res(
      ctx.status(200, 'Mock success'),
      ctx.json({
        ...data,
        id,
      }),
    )
  }),
)

export default server

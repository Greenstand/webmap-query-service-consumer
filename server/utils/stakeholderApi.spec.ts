import server from '@mock/createStakeholderApi'
import data from '@mock/stakeholder.json'
import { getStakeholder, getStakeholderMap } from './stakeholderApi'

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

it('should get data with matching id from stakeholder api', async () => {
  const stakeholderId = data.id
  const res = await getStakeholder(stakeholderId)
  expect(res?.id).toBe(data.id)
})

it('should get map name from stakeholder api', async () => {
  const stakeholderId = data.id
  const map = await getStakeholderMap(stakeholderId)
  expect(map).toBe(data.map)
})

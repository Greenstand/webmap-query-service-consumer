import data from '@mock/stakeholder.json'
import server from '@mock/stakeholderApi'
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

it('should handle error', async () => {
  const stakeholderId = ''
  const map = await getStakeholderMap(stakeholderId)
  expect(map).toBeUndefined()
})

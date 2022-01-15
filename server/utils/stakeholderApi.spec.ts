import { SetupServerApi } from 'msw/lib/types/node'
import data from '@test/mock/stakeholder.json'
import { createStakeholderApi } from '@test/stakeholderApi'
import { getStakeholderMap } from './stakeholderApi'

let mockServer: SetupServerApi

beforeAll(() => {
  mockServer = createStakeholderApi()
  mockServer.listen()
})

afterAll(() => {
  mockServer.close()
})

it('should get map name from stakeholder api', async () => {
  const stakeholderId = data.id
  const map = await getStakeholderMap(stakeholderId)
  expect(map).toBe(data.map)
})

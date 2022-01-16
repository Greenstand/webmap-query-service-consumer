import { SetupServerApi } from 'msw/lib/types/node'
import createStakeholderApi from '@test/createStakeholderApi'
import data from '@test/mock/stakeholder.json'
import { getStakeholder, getStakeholderMap } from './stakeholderApi'

let mockServer: SetupServerApi

beforeAll(() => {
  mockServer = createStakeholderApi()
  mockServer.listen()
})

afterAll(() => {
  mockServer.close()
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

import data from '@test/mock/stakeholder.json'
import { getStakeholderMap } from './stakeholder'

it('should get map name from stakeholder api', async () => {
  const stakeholderId = data.id
  const map = await getStakeholderMap(stakeholderId)
  expect(map).toBe(data.map)
})

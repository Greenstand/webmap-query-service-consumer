import axios from 'axios'
import MapName from 'interfaces/MapName'
import Stakeholder from 'interfaces/Stakeholder'

const stakeholderApiRoute = process.env.STAKEHOLDER_API_ROUTE

export async function getStakeholder(
  stakeholderId: string,
): Promise<Stakeholder | void> {
  if (!stakeholderApiRoute)
    return console.error('env var: STAKEHOLDER_API_ROUTE is not set')
  const res = await axios.get(stakeholderApiRoute, {
    params: {
      stakeholder_id: stakeholderId,
    },
  })
  return res.data
}

export async function getStakeholderMap(
  stakeholderId: string,
): Promise<MapName | void> {
  const data = await getStakeholder(stakeholderId)
  return data?.map
}

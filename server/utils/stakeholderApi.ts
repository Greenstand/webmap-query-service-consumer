import path from 'path'
import axios from 'axios'
import Stakeholder from 'interfaces/Stakeholder'

export const stakeholderRoute = 'stakeholder/'
const stakeholderHost = process.env.STAKEHOLDER_API_HOST || ''
const url = path.join(stakeholderHost, stakeholderRoute)

export async function getStakeholder(
  stakeholderId: string,
): Promise<Stakeholder | void> {
  if (!url) return console.error('env var: STAKEHOLDER_API_ROUTE is not set')
  try {
    const res = await axios.get(url, {
      params: {
        stakeholder_id: stakeholderId,
      },
    })
    return res.data
  } catch (err) {
    return console.error((err as Error).message)
  }
}

export async function getStakeholderMap(
  stakeholderId: string,
): Promise<string | undefined> {
  const data = await getStakeholder(stakeholderId)
  return data?.map
}

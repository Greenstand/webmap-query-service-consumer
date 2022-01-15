import axios from 'axios'

const stakeholderApiRoute = process.env.STAKEHOLDER_API_ROUTE

export async function getStakeholderMap(stakeholderId: string) {
  if (!stakeholderApiRoute)
    return console.error('env var: STAKEHOLDER_API_ROUTE is not set')
  const path = `${stakeholderApiRoute}/${stakeholderId}`
  const res = await axios.get(path)
  const { map } = res.data
  return map
}

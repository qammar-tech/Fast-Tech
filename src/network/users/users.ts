import { useQuery, UseQueryOptions } from 'react-query'
import { fetchData } from '@/network/api'

const endpoints = {
  search: '/user/search'
}

// Queries
export const useSearchUser = (
  options?: UseQueryOptions,
  queryParam?: string
) => {
  return useQuery(
    'searchUsers',
    () =>
      fetchData(
        endpoints.search,
        {
          query: queryParam
        },
        {
          authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      ),
    options as any
  ) as any
}

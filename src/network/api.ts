import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL

// Fetch function for queries
export const fetchData = async (url: string, queryData = {}, headers = {}) => {
  return await axios.get(`${API_BASE_URL}${url}`, {
    params: queryData,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: '*/*',
      ...headers
    }
  })
}

// Mutate function for mutations
export const mutateData = async ({
  url,
  data,
  headers = {} as any | undefined
}: {
  url: string
  data: FormData
  headers?: any
}) => {
  return await axios.post(`${API_BASE_URL}${url}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: '*/*',
      ...headers
    }
  })
}

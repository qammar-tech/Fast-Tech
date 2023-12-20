import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions
} from 'react-query'
import { fetchData, mutateData } from '@/network/api'

const endpoints = {
  signUp: '/auth/registration',
  signIn: '/auth/login',
  getUser: '/user'
}

// Queries
export const useGetUser = (options?: UseQueryOptions) => {
  return useQuery(
    'signIn',
    () => fetchData(endpoints.getUser),
    options as any
  ) as any
}

export const useSignIn = (options?: UseMutationOptions) => {
  return useMutation(
    (data: any) => mutateData({ url: endpoints.signIn, data }),
    options
  ) as any
}

// Mutations
export const useSignUp = (options?: UseMutationOptions) => {
  return useMutation(
    (data: any) => mutateData({ url: endpoints.signUp, data }),
    options
  ) as any
}

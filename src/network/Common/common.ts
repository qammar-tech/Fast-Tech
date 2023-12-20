import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions
} from 'react-query'
import { fetchData, mutateData } from '@/network/api'

const endpoints = {
  addPaymentCard: '/customer/paymentmethod/createPaymentMethod',
  getPaymentCard: '/customer/paymentmethod/getPaymentCards',
  deletePaymentCard: '/customer/paymentmethod/deletePaymentMethods',
  addAddress: '/customer/address/add',
  getAddress: '/customer/address/list',
  config: '/config',
  autocomplete: '/mapapi/place-api-autocomplete',
  addFavouriteProduct: '/customer/wish-list/add',
  getFavouriteProduct: '/customer/wish-list',
  removeFavouriteProduct: '/customer/wish-list/remove',
}


export const usePaymentCard = (options?: UseMutationOptions) => {
  return useMutation(
    (data: any) => mutateData({ url: endpoints.addPaymentCard, data , headers: {
      authorization: `Bearer ${localStorage.getItem('access_token')}`
    }}),
    options
  ) as any
}
export const useAddFavouriteProduct = (options?: UseMutationOptions) => {
  return useMutation(
    (data: any) => mutateData({ url: endpoints.addFavouriteProduct, data , headers: {
      authorization: `Bearer ${localStorage.getItem('access_token')}`
    }}),
    options
  ) as any
}
export const useGetPaymentCard = (options?: UseMutationOptions) => {
  return useMutation(
    (data: any) => mutateData({ url: endpoints.getPaymentCard, data , headers: {
      authorization: `Bearer ${localStorage.getItem('access_token')}`
    }}),
    options
  ) as any
}
export const useDeletePaymentCard = (options?: UseMutationOptions) => {
  return useMutation(
    (data: any) => mutateData({ url: endpoints.deletePaymentCard, data , headers: {
      authorization: `Bearer ${localStorage.getItem('access_token')}`
    }}),
    options
  ) as any
}
export const useAddAddress = (options?: UseMutationOptions) => {
  return useMutation(
    (data: any) => mutateData({ url: endpoints.addAddress, data , headers: {
      authorization: `Bearer ${localStorage.getItem('access_token')}`
    }}),
    options
  ) as any
}
export const useGetAddress = (
  options?: UseQueryOptions,
) => {
  return useQuery(
    'getAddress',
    () =>
      fetchData(
        endpoints.getAddress,
        {
        },
        {
          authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      ),
    options as any
  ) as any
}
export const useConfig = (
  options?: UseQueryOptions,
  queryParam?: string | number
) => {
  return useQuery(
    'config',
    () =>
      fetchData(
        endpoints.config,
        {
          restaurant_id: queryParam
        },
        {
          authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      ),
    options as any
  ) as any
}
export const useAutocomplete = (
  options?: UseQueryOptions,
  queryParam?: string | number
) => {
  return useQuery(
    'autocomplete',
    () =>
      fetchData(
        endpoints.autocomplete,
        {
          search_text: queryParam
        },
        {
        }
      ),
    options as any
  ) as any
}
export const useRemoveFavouriteProduct = (
  options?: UseQueryOptions,
  queryParam?: string | number
) => {
  return useQuery(
    'removeFavouriteProduct',
    () =>
      fetchData(
        endpoints.removeFavouriteProduct,
        {
          product_id: queryParam
        },
        {
        }
      ),
    options as any
  ) as any
}
export const useGetFavouriteProduct = (
  options?: UseQueryOptions,
) => {
  return useQuery(
    'getFavouriteProduct',
    () =>
      fetchData(
        endpoints.getFavouriteProduct,
        {
        },
        {
          authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      ),
    options as any
  ) as any
}

import { useMutation, UseMutationOptions } from 'react-query'
import { fetchData, mutateData } from '@/network/api'

const endpoints = {
  placeOrder: '/customer/order/place'
}

export const usePlaceOrder = (options?: UseMutationOptions) => {
  return useMutation(
    (data: any) =>
      mutateData({
        url: endpoints.placeOrder,
        data,
        headers: {
          authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }),
    options
  ) as any
}

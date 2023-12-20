import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions
} from 'react-query'
import { fetchData, mutateData } from '@/network/api'

const endpoints = {
  checkPhone: '/auth/check-phone',
  verifyPhone: '/auth/verify-phone',
  forgetPassword: '/auth/forgot-password',
  verifyToken: '/auth/verify-token',
  resetPassword: '/auth/reset-password',
  ChatChannelMessage: '/chat_channels/{chat_channel_id}/chat_channel_messages',
  requestChatChannelVideo:
    '/chat_channels/{chat_channel_id}/request_video_session',
  respondChatChannelVideo:
    '/chat_channels/{chat_channel_id}/respond_video_session',
  chatChannelEndVideo: '/chat_channels/{chat_channel_id}/end_video',
  chatChannelEndsession: '/chat_channels/{chat_channel_id}/end_session'
}


export const useGetChatChannelMessages = (
  options?: UseQueryOptions,
  chat_channel_id?: number,
  page = 1,
  perPage = 25
) => {
  return useQuery(
    `chat_channel_${chat_channel_id}_messages`,
    () =>
      fetchData(
        endpoints.ChatChannelMessage.replace(
          '{chat_channel_id}',
          `${chat_channel_id}`
        ),
        {
          page,
          per_page: perPage
        },
        {
          authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      ),
    options as any
  ) as any
}

export const useCheckPhone = (options?: UseMutationOptions) => {
  return useMutation(
    (data: any) =>
      mutateData({
        url: endpoints.checkPhone,
        data,
        headers: {
          // authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }),
    options
  ) as any
}
export const useVerifyPhone = (options?: UseMutationOptions) => {
  return useMutation(
    (data: any) =>
      mutateData({
        url: endpoints.verifyPhone,
        data,
        headers: {
          // authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }),
    options
  ) as any
}
export const useForgetPassword = (options?: UseMutationOptions) => {
  return useMutation(
    (data: any) =>
      mutateData({
        url: endpoints.forgetPassword,
        data,
        headers: {
          // authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }),
    options
  ) as any
}
export const useVerifyToken = (options?: UseMutationOptions) => {
  return useMutation(
    (data: any) =>
      mutateData({
        url: endpoints.verifyToken,
        data,
        headers: {
          // authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }),
    options
  ) as any
}
export const useResetPassword = (options?: UseMutationOptions) => {
  return useMutation(
    (data: any) =>
      mutateData({
        url: endpoints.resetPassword,
        data,
        headers: {
          // authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }),
    options
  ) as any
}

export const useRequestChatChannelVideo = (
  options?: UseMutationOptions,
  chat_channel_id?: number
) => {
  return useMutation(
    (data: any) =>
      mutateData({
        url: endpoints.requestChatChannelVideo.replace(
          '{chat_channel_id}',
          `${chat_channel_id}`
        ),
        data,
        headers: {
          authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }),
    options
  ) as any
}

export const useRespondChatChannelVideo = (
  options?: UseMutationOptions,
  chat_channel_id?: number
) => {
  return useMutation(
    (data: any) =>
      mutateData({
        url: endpoints.respondChatChannelVideo.replace(
          '{chat_channel_id}',
          `${chat_channel_id}`
        ),
        data,
        headers: {
          authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }),
    options
  ) as any
}

export const useChatChannelVideoEnd = (
  options?: UseMutationOptions,
  chat_channel_id?: number
) => {
  return useMutation(
    (data: any) =>
      mutateData({
        url: endpoints.chatChannelEndVideo.replace(
          '{chat_channel_id}',
          `${chat_channel_id}`
        ),
        data,
        headers: {
          authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }),
    options
  ) as any
}

export const useChatChannelSessionEnd = (
  options?: UseMutationOptions,
  chat_channel_id?: number
) => {
  return useMutation(
    (data: any) =>
      mutateData({
        url: endpoints.chatChannelEndsession.replace(
          '{chat_channel_id}',
          `${chat_channel_id}`
        ),
        data,
        headers: {
          authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }),
    options
  ) as any
}

export const useCreateChatChannelMessage = (
  options?: UseMutationOptions,
  chat_channel_id?: number
) => {
  return useMutation(
    (data: any) =>
      mutateData({
        url: endpoints.ChatChannelMessage.replace(
          '{chat_channel_id}',
          `${chat_channel_id}`
        ),
        data,
        headers: {
          authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }),
    options
  ) as any
}

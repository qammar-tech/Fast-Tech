import { useQuery, UseQueryOptions } from 'react-query'
import { fetchData } from '@/network/api'

const endpoints = {
  recommendedSides: '/products/get_recomended_sides',
  relatedProducts: '/products/related-products/{product_id}',
  singleProduct: '/products/details/{product_id}',
  popularProducts: '/products/popular',
  getAllProducts: '/categories/allproducts/{product_id}',
  getRelatedBeverages: '/products/get_recomended_beverages',
  getAllPopularProducts: '/products/allpopular'
}

// Queries
export const useRecommendedSides = (
  options?: UseQueryOptions,
  queryParam?: string | number
) => {
  return useQuery(
    'recommendedSides',
    () =>
      fetchData(
        endpoints.recommendedSides,
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

export const useRelatedProducts = (
  options?: UseQueryOptions,
  queryParam?: string | number,
  product_id?: number
) => {
  return useQuery(
    `relatedProducts_${product_id}`,
    () =>
      fetchData(
        endpoints.relatedProducts.replace('{product_id}', `${product_id}`),
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

export const getRelatedBeverages = (
  options?: UseQueryOptions,
  restaurant_id?: string | number
) => {
  return useQuery(
    `relatedBeverages_${restaurant_id}`,
    () =>
      fetchData(endpoints.getRelatedBeverages, {
        restaurant_id
      }),
    options as any
  ) as any
}

export const useSingleProduct = (
  options?: UseQueryOptions,
  product_id?: number
) => {
  return useQuery(
    `singleProduct_${product_id}`,
    () =>
      fetchData(
        endpoints.singleProduct.replace('{product_id}', `${product_id}`),
        {
          // authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      ),
    options as any
  ) as any
}

export const usePopularProducts = (
  options?: UseQueryOptions,
  queryParam?: string | number
) => {
  return useQuery(
    'recommendedSides',
    () =>
      fetchData(
        endpoints.popularProducts,
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

export const getAllProducts = (
  options?: UseQueryOptions,
  restaurant_id?: string | number
) => {
  return useQuery(
    'getAllProducts',
    () =>
      fetchData(
        endpoints.getAllProducts.replace('{product_id}', `${restaurant_id}`)
      ),
    options as any
  )
}

export const getAllPopularProducts = (
  options?: UseQueryOptions,
  restaurant_id?: string | number
) => {
  return useQuery(
    `getAllPopularProducts_${restaurant_id}`,
    () =>
      fetchData(endpoints.getAllPopularProducts, {
        restaurant_id
      }),
    options as any
  ) as any
}

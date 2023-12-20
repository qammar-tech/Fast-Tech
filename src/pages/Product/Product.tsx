import Navbar from '@/components/NavBar/Navbar'
import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";
import { getRelatedBeverages, useRecommendedSides, useRelatedProducts, useSingleProduct } from '@/network/products/products'
import { useAddFavouriteProduct, useGetFavouriteProduct, useRemoveFavouriteProduct } from '@/network/Common/common'
import { restaurantData } from '@/mocks/common';
import './products.css'
import { toast, ToastContainer } from 'react-toastify';
import { useConfig } from '@/network/Common/common';

import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import axios from 'axios';
export default function Product() {
  const { id } = useParams<any>()
  const history = useHistory()
  let [count, setCount] = useState(0);
  let [itemsCount, setItemsCount] = useState(0);
  let [totalCartPrice, setTotalCartPrice] = useState(0);
  const [recommendedSides, setRecommendedSides] = useState([])
  const [ config, setConfig ] = useState<any>({})
  const [restaurant_id, setRestaurantId] = useState(restaurantData?.restaurant_id)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<any>()
  const [localStorageOrderItems, setLocalStorageOrderItems] = useState<any>(localStorage.getItem('cart_items'))
  const [orderItems, setOrderItems] = useState<any>([])
  const addFavouriteProduct = useAddFavouriteProduct()
  const [isWishlist, setIsWishList] = useState<boolean>(false)
  function incrementCount() {

    count = count + 1;
    setCount(count);

    let cartItems = [...orderItems];
    cartItems = [...cartItems, product]
    setOrderItems(cartItems)
  }

  function incrementItemsCount(e: any, item?: any) {
    let cartItems = [...orderItems];
    itemsCount = itemsCount + 1;
    setItemsCount(itemsCount);
    totalCartPrice = totalCartPrice + e
    setTotalCartPrice(totalCartPrice)

    if (item) {
      cartItems = [...cartItems, item]
    }

    setOrderItems(cartItems)

  }

  function decrementCount() {
    if (count === 0) {
      return
    }

    count = count - 1;
    setCount(count);

    let cartItems = [...orderItems];
    const productIndex = cartItems?.findIndex((item: any) => item?.id === product?.id)

    if (productIndex !== -1) {
      cartItems.splice(productIndex, 1)
      setOrderItems(cartItems)
    }
  }

  useRecommendedSides(
    {
      queryKey: `recommendedSides_${restaurant_id}`,
      onSuccess: (response: any) => {
        setRecommendedSides(response.data.products)

      },
    },
    restaurant_id
  )

  const RemoveFavouriteProduct = async () => {
    try {
      const response = await axios.delete(`https://cafescale.com/api/v1/customer/wish-list/remove?product_id=${id}`
      ,  {
        headers: {
          authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      // Check the response status or handle other logic based on the response
      if (response.status === 200) {
        setIsWishList(false)
        toast("Product removed from wishlist successfully.")
        console.log('Product removed from wishlist successfully.');
      } else {
        toast.error("Failed to remove product from wishlist.")
        console.error('Failed to remove product from wishlist.');
      }
    } catch (error:any) {
      console.error('Error removing product from wishlist:', error.message);
    }
  };

useEffect(()=>{
setIsWishList(!isWishlist)
},[])
  // Call the function with the product ID
  getRelatedBeverages(
    {
      queryKey: `relatedBeverages_${restaurant_id}`,
      onSuccess: (response: any) => {
        setRelatedProducts(response?.data?.products)
      },
    },
    restaurant_id
  )

  useSingleProduct(
    {
      queryKey: `singleProduct`,
      onSuccess: (response: any) => {
        setProduct(response?.data)
      },
    },
    id
  )
  useGetFavouriteProduct(
    {
      onSuccess: (response: any) => {

        const isProduct = response?.data?.products.map((product: any) => product?.id).filter((value: number) => value == id)
        if (isProduct.length > 0) {
          setIsWishList(true)
        }
      },
    },
  )

  useConfig(
    {
      queryKey: `config_${restaurantData.restaurant_id}`,
      onSuccess: (response: any) => {
        setConfig(response?.data)
      },
    },
    restaurantData.restaurant_id
  )
  const clearState = async () => {
    await setCount(0);
    await setItemsCount(0);
    await setTotalCartPrice(0);
  }

  const addToCart = (e: any) => {
    e.preventDefault()

    let cart = [...orderItems]

    let localStorageObj = JSON.parse(localStorageOrderItems)
    if (localStorageObj?.cart && localStorageObj?.cart?.length) {
      cart = [...cart, ...localStorageObj?.cart]
    }

    localStorage.setItem('cart_items', JSON.stringify({ user_id: localStorage.getItem('user_id'), cart }))
    clearState()

    toast("Items Added to Cart Successfully.")
  }

  const handleFavourite = async (id: number) => {
    try {
      setLoading(true);

      const response = await addFavouriteProduct.mutateAsync({
        product_id: id
      });
      if (response.status === 200) {
        toast('Product added to wishlist.');
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.errors[0]?.message);
      console.log('error', error?.response?.data?.errors[0]?.message);
    }
  }
  useEffect(() => {
    // Toggle isWishList state when the component mounts or when the user's wishlist changes
    setIsWishList(orderItems.some((item: any) => item.id === product?.id));
  }, [orderItems, product]);

  const continueToCheckoutButton = () => {
    history.push('/cart')
  }

  return (
    <>
      <div className="container-fluid p-0">
        <div className="row m-0">
          <div className="col-lg-4 col-sm-12 p-0">
            <div className="h-[30%]">
              <img
                className="w-100 h-100"
                src={`${config?.base_urls?.product_image_url}/${product?.image}`}
                alt="Product"
              />
            </div>
            <div className="bg-black opacity-90 h-[70%] w-100 p-5">
              <div className='grid'>
                <div className='flex justify-between'>
                  <span className='text-white font-bold text-4xl'>{product?.name}</span>
                  <span className='text-gray-300 font-bold text-4xl'>${product?.price}</span>
                </div>
                <br></br>
                <span className='text-gray-400 text-base'>{product?.description}</span>
              </div>
              <div className='flex mt-3 gap-3'>
                {
                  isWishlist ?
                    <FaHeart className="text-red-500 text-2xl cursor-pointer" onClick={RemoveFavouriteProduct} />
                    :
                    <FaRegHeart className="text-red-500 text-2xl cursor-pointer" onClick={() => handleFavourite(product.id)} />
                }
                <span className='text-white text-base'>{product?.popularity_count}</span>
                <span className='text-white text-base cursor-pointer'>Like</span>
              </div>
            </div>
          </div>
          <div className="col-lg-8 col-sm-12 bg-black pt-5 overflow-hidden">
            <div className='row'>
              <div className="col-lg-2">
              </div>
              <div className="col-lg-8 col-sm-12">
                <div className='grid'>
                  <div className='flex'>
                    <span className='text-white text-2xl mr-2'>Quantity
                    </span>
                    <button
                      onClick={incrementCount}
                      className="w-8 h-8 mr-2 border-2 border-gray-300 text-white rounded-md text-gray-600 hover:bg-gray-600 focus:outline-none focus:ring focus:border-blue-300"
                    >
                      +
                    </button>
                    <span className='text-white'>{count}</span>
                    <button
                      onClick={decrementCount}
                      className="w-8 h-8 ml-2 border-2 border-gray-300 text-white rounded-md text-gray-600 hover:bg-gray-600 focus:outline-none focus:ring focus:border-blue-300"
                    >
                      -
                    </button>
                    <div className='lg:ml-[7rem]'>
                      <button className='add-cart-btn ml-3' onClick={(e) => addToCart(e)}>
                        Add Items{'   '}({(count + itemsCount)}){' '} ${(totalCartPrice + (count * product?.price)).toFixed(2)}
                      </button>
                    </div>
                  </div>
                  <br></br>
                  {/* <span className='text-white text-2xl'>Special Instructions</span>
                    <input className='instructions-input h-[100px] p-3 text-white' placeholder='We can not accept price altering changings here.' type="text"
                    name="email_or_phone"
                    /> */}
                  <span className='text-white text-2xl'>Recommended Sides</span>
                  <hr className='w-[100%] text-white mt-2 mb-4 border-2 border-gray-300' />
                  <div className='overflow-y-auto'>

                    <div className='flex gap-3 overflow-x-auto'>
                      {recommendedSides.map((value: any) => (
                        <div
                          key={value.id}
                          className='flex-none w-[170px] md:w-[200px] h-[200px] border-1 border-green-500 rounded-lg cursor-pointer hover:opacity-90 ml-3'
                          onClick={() => incrementItemsCount(value.price, value)}
                        >
                            <div className='grid'>
                              <img
                                className='h-[100px] w-full rounded-md'
                                src={`${config?.base_urls?.product_image_url}/${value?.image}`}
                                alt={value.name}
                              />
                              <div className='pt-1 p-1'>
                                <span className='text-gray-300 text-md'>{value?.name}</span>
                              </div>
                              <div className='flex justify-between pl-3 pr-3 pt-2'>
                                <span className='text-white text-bold text-lg'>${value?.price}</span>
                                <IoMdAddCircleOutline className='text-green-500 text-2xl cursor-pointer' />
                              </div>
                            </div>
                          </div>
                      ))
                      }
                    </div>


                    <br></br>

                    <hr className='w-[100%] text-white mt-1 mb-5 border-2 border-gray-300' />

                  </div>
                  <span className='text-white text-2xl'>Related Beverages</span>
                  <hr className='w-[100%] text-white mt-2 mb-4 border-2 border-gray-300' />
                  <div className='overflow-y-auto'>

                      <div className='flex gap-3 overflow-x-auto'>
                        {relatedProducts?.map((value: any) => (
                          <div
                            key={value.id}
                            className='flex-none w-[170px] md:w-[200px] h-[200px] border-1 border-green-500 rounded-lg cursor-pointer hover:opacity-90 ml-3'
                            onClick={() => incrementItemsCount(value.price, value)}
                          >
                              <div className='grid'>
                                <img
                                  className='h-[100px] w-full rounded-md'
                                  src={`${config?.base_urls?.product_image_url}/${value?.image}`}
                                  alt={value.name}
                                />
                                <div className='pt-1 p-1'>
                                  <span className='text-gray-300 text-md'>{value?.name}</span>
                                </div>
                                <div className='flex justify-between pl-3 pr-3 pt-2'>
                                  <span className='text-white text-bold text-lg'>${value?.price}</span>
                                  <IoMdAddCircleOutline className='text-green-500 text-2xl cursor-pointer' />
                                </div>
                              </div>
                            </div>
                      ))
                      }
                    </div>


                    <br></br>

                    <hr className='w-[100%] text-white mt-1 mb-5 border-2 border-gray-300' />

                  </div>
                  <div className='flex mb-4'>
                    <button className='ml-2 home-btn p-2' onClick={() => history.push('/home')}>Back to Home</button>
                    <button className='ml-2 save-btn p-2' onClick={continueToCheckoutButton}>Continue to Cart</button>
                  </div>
                </div>
              </div>
              <div className="col-2">
              </div>
            </div>

          </div>
        </div>
      </div>
      <ToastContainer />

    </>
  );
}


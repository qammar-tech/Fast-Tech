import React, { useState, useEffect } from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link, useHistory } from 'react-router-dom';
import { IoMdAddCircleOutline } from "react-icons/io";
import { usePopularProducts } from '@/network/products/products'
import { restaurantData } from '@/mocks/common';
import './cart.css'
import { useConfig } from '@/network/Common/common';
export default function Cart() {
  let [count, setCount] = useState(0);
  let [itemsCount, setItemsCount] = useState(0);
  let [totalCartPrice, setTotalCartPrice] = useState(0);
  const [recommendedSides, setRecommendedSides] = useState([])
  const [cartItems, setCartItems] = useState<any>(JSON.parse(localStorage.getItem('cart_items') as any))
  const [cart, setCart] = useState<any>([])
  const [config, setConfig] = useState<any>({})
  const [restaurant_id, setRestaurantId] = useState(restaurantData?.restaurant_id)
  const [ tip, setTip ] = useState<any>(0)
  const history = useHistory();
  const [ enable, setEnable ] = useState<any>(false)

  async function incrementCount(product: any) {
    await setEnable(true)
    let duplicateCart = [...cart]
    let duplicateCartItems = [...cartItems?.cart]
    let foundedItem = duplicateCart?.find((item: any) => item?.id === product?.id);
    const foundedItemIndex = duplicateCart?.findIndex((item: any) => item?.id === product?.id);

    duplicateCartItems.push({...foundedItem })
    await localStorage.setItem('cart_items', JSON.stringify({ user_id: localStorage.getItem('user_id'), cart: duplicateCartItems }))

    setCartItems({ user_id: localStorage.getItem('user_id'), cart: duplicateCartItems})


    foundedItem = {
      ...foundedItem,
      quantity: foundedItem?.quantity + 1,
      totalPrice: foundedItem?.totalPrice + foundedItem?.price
    }

    duplicateCart.splice(foundedItemIndex, 1, foundedItem)
    setCart(duplicateCart)
    setEnable(false)
  }

  function incrementItemsCount(product: any) {
    itemsCount = itemsCount + 1;
    setItemsCount(itemsCount);
    totalCartPrice = totalCartPrice + product?.price
    setTotalCartPrice(totalCartPrice)
  }

  async function decrementCount(product: any) {
    await setEnable(true)
    let duplicateCart = [...cart]
    let duplicateCartItems = [...cartItems?.cart]
    let foundedItem = duplicateCart?.find((item: any) => item?.id === product?.id);
    const foundedItemIndex = duplicateCart?.findIndex((item: any) => item?.id === product?.id);

    if(foundedItem?.quantity > 1) {
      foundedItem = {
        ...foundedItem,
        quantity: foundedItem?.quantity - 1,
        totalPrice: foundedItem?.totalPrice - foundedItem?.price
      }

      duplicateCart.splice(foundedItemIndex, 1, foundedItem)

      setCart(duplicateCart)
    }else {
      duplicateCart.splice(foundedItemIndex, 1)

      setCart(duplicateCart)
    }

    let duplicateCartItemsIndex = duplicateCartItems.findIndex((item: any) => item?.id === product.id)
    duplicateCartItems.splice(duplicateCartItemsIndex, 1)

    setCartItems({ user_id: localStorage.getItem('user_id'), cart: duplicateCartItems})
    await localStorage.setItem('cart_items', JSON.stringify({ user_id: localStorage.getItem('user_id'), cart: duplicateCartItems }))
    setEnable(false)
  }

  usePopularProducts(
    {
      queryKey: `popularProducts_${restaurant_id}`,
      onSuccess: (response: any) => {
        setRecommendedSides(response.data.products)

      },
    },
    restaurantData.restaurant_id
  )

  useConfig(
    {
      queryKey: `config${restaurant_id}`,
      onSuccess: (response: any) => {
        setConfig(response?.data)
      },
    },
    restaurant_id
  )

  const tipAddHandler = (price: any) => {
    setTip(price)
  }

  const continueToCheckoutButton = () => {
    localStorage.setItem('totalCheckoutAmount', (cartItems?.cart?.reduce((a: number, item: any) => a + item?.price, 0) + config?.delivery_charge + config?.service_fee_estimated_tax + ( tip ? (tip / 100)*(cartItems?.cart?.reduce((a: number, item: any) => a + item?.price, 0) + config?.delivery_charge + config?.service_fee_estimated_tax) : 0 )).toFixed(2));
    history.push(`/checkout`);
  }

  const addItemToCart = (item: any) => {
    let cart = [...cartItems?.cart]

    cart.push({...item})

    localStorage.setItem('cart_items', JSON.stringify({ user_id: localStorage.getItem('user_id'), cart }))

    setCartItems(({ user_id: localStorage.getItem('user_id'), cart }))
  }


  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart_items') as any);
    const updatedCart:any = [];

    cartItems?.cart?.forEach((product: any) => {
      let foundedProduct = updatedCart?.find((item: any) => item?.id === product?.id)
      const foundedProductIndex = updatedCart?.findIndex((item: any) => item?.id === product?.id)
      if(foundedProductIndex !== -1) {
        foundedProduct = {
          ...foundedProduct,
          quantity: foundedProduct?.quantity + 1,
          totalPrice: foundedProduct?.price * (foundedProduct?.quantity + 1)
        }

        updatedCart.splice(foundedProductIndex, 1, foundedProduct)
      }else {
        updatedCart.push({
          ...product,
          quantity: 1,
          totalPrice: product?.price
        })
      }
    })

    setCart(updatedCart)
  }, [])

  return (
    <div className='bg-black'>
      <div className="container mx-auto">
        <div className="shadow-md py-5">
          <div className='row'>
            <div className="col-lg-5 bg-black px-10 flex-none bg-black h-[100vh] border-2 border-green-500 rounded-lg overflow-auto">
              <div className="flex justify-between border-b pb-8 pt-2">
                <h1 className="font-semibold text-2xl text-white">Shopping Cart</h1>
                <h2 className="font-semibold text-2xl text-white">{cartItems?.cart?.length || 0} { cartItems?.cart?.length === 1 ? "Item" : "Items"} </h2>
              </div>
              <div className="flex mt-10 mb-5">
                <h3 className="font-semibold text-gray-500 text-xs uppercase w-2/5 text-white">Product Details</h3>
                <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center text-white">Quantity</h3>
                <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center text-white">Price</h3>
                <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center text-white">Total</h3>
              </div>
              {
                cart?.map((item: any) => {
                  return (
                    <>
                      <div className="flex items-center hover:bg-green-700 hover:opacity-90 hover:text-black hover:rounded-md -mx-8 px-6 py-5">
                        <div className="flex w-2/5">
                          <div className="w-20">
                            <img className="h-24" src={`${config?.base_urls?.product_image_url}/${item?.image}`} alt="" />
                          </div>
                          <div className="flex flex-col justify-between ml-4 flex-grow">
                            <span className="font-bold text-sm text-white">{item.name}</span>
                            <RiDeleteBin6Line href="#" className="font-semibold hover:text-red-800 text-gray-500 text-2xl cursor-pointer text-red-500" />
                          </div>
                        </div>
                        <div className="flex justify-center w-1/5">
                          <button
                            disabled={enable}
                            onClick={() => incrementCount(item)}
                            className="w-8 h-8 mr-5 border-2 border-gray-300 text-white rounded-md text-gray-600 hover:bg-black focus:outline-none focus:ring focus:border-blue-300"
                          >
                            +
                          </button>
                          <span className='text-white'>{item?.quantity}</span>
                          <button
                            disabled={enable}
                            onClick={() => decrementCount(item)}
                            className="w-8 h-8 ml-5 border-2 border-gray-300 text-white rounded-md text-gray-600 hover:bg-black  focus:outline-none focus:ring focus:border-blue-300"
                          >
                            -
                          </button>
                        </div>
                        <span className="text-center w-1/5 font-semibold text-sm text-white ">{config?.currency_symbol} { item.price }</span>
                        <span className="text-center w-1/5 font-semibold text-sm text-white">{config?.currency_symbol} { item.totalPrice.toFixed(2) }</span>
                      </div>
                      <hr className='w-[100%] text-white border-3 border-green-500' />
                    </>
                  )
                })
              }
              <Link className="flex font-semibold text-green-600 text-sm mt-10" to={'/home'}>

                <svg className="fill-current mr-2 text-green-600 w-4" viewBox="0 0 448 512"><path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" /></svg>
                Continue Shopping
              </Link>
            </div>
            <div className='col-lg-1'>
            </div>
            <div className='col-lg-6 bg-black px-10 flex-none bg-black h-[100vh] border-2 border-green-500 rounded-lg'>

              <div className='lg:p-3'>
                <span className='text-white text-2xl'>Recommended Sides</span>
                <hr className='w-[100%] text-white mt-2 mb-4 border-2 border-gray-300' />
                <div className='overflow-y-auto'>

                  <div className='flex gap-3 overflow-x-auto'>
                    {recommendedSides.map((value: any) => (
                      <div
                        key={value.id}
                        className='flex-none w-[170px] md:w-[200px] h-[200px] border-1 border-green-500 rounded-lg cursor-pointer hover:opacity-90 ml-3'
                        onClick={() => incrementItemsCount(value)}
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
                            <IoMdAddCircleOutline className='text-green-500 text-2xl cursor-pointer' onClick={() => addItemToCart(value)} />
                          </div>
                        </div>
                      </div>
                    ))
                    }
                  </div>


                  <br></br>

                  <hr className='w-[100%] text-white mt-1 mb-2 border-2 border-gray-300' />

                </div>
              </div>
              <div className='flex justify-between mb-3'>
                <input
                  className='coupon-input p-3 text-white'
                  placeholder='Enter your coupon here'
                  type="text"
                  name="coupon"
                />
              <button className='coupon-btn p-2' type='submit'>Apply</button>

              </div>
              <div>

                <span className='text-bold text-white text-xl'>Tip the Crew</span>
                <div className='mt-3'>
                  <button className='tip-btn' onClick={() => tipAddHandler(10)} >10%</button>
                  <button className='tip-btn' onClick={() => tipAddHandler(15)}>15%</button>
                  <button className='tip-btn' onClick={() => tipAddHandler(20)}>20%</button>
                  <button className='tip-btn' onClick={() => tipAddHandler(5)}>other</button>
                </div>
              </div>
              <div className='grid'>
                <div className='flex justify-between mt-4'>
                  <span className='text-bold text-white text-lg'>Items Price</span>
                  <span className='text-bold text-white text-lg'>{config?.currency_symbol} { cartItems?.cart?.reduce((a: number, item: any) => a + item?.price, 0).toFixed(2) }</span>
                </div>
                <div className='flex justify-between mt-4'>
                  <span className='text-bold text-white text-lg'>Fee & Taxes</span>
                  <span className='text-bold text-white text-lg'>{config?.currency_symbol} {config?.service_fee_estimated_tax?.toFixed(2)}</span>
                </div>
                <div className='flex justify-between mt-4'>
                  <span className='text-bold text-white text-lg'>Dilevery Fee</span>
                  <span className='text-bold text-white text-lg'>{config?.currency_symbol} {config?.delivery_charge}</span>
                </div>
                <hr className='w-[100%] mt-3 text-white border-3 border-green-500' />
                <div className='flex justify-between mt-4'>
                  <span className='text-bold text-gray-400 text-2xl'>Total Amount</span>
                  <span className='text-bold text-white text-2xl'>{config?.currency_symbol} { (cartItems?.cart?.reduce((a: number, item: any) => a + item?.price, 0) + config?.delivery_charge + config?.service_fee_estimated_tax + ( tip ? (tip / 100)*(cartItems?.cart?.reduce((a: number, item: any) => a + item?.price, 0) + config?.delivery_charge + config?.service_fee_estimated_tax) : 0 )).toFixed(2) } </span>
                </div>
                <hr className='w-[100%] my-3 text-white border-3 border-green-500' />

                <div className='flex'>
                  <button className='home-btn' onClick={() => history.push(`/home`)}>Home</button>
                  <button className='checkout-btn' onClick={continueToCheckoutButton}>Continue to Checkout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

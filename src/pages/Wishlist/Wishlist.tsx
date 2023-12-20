import React, { useState } from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link, useHistory } from 'react-router-dom';
import { IoMdAddCircleOutline } from "react-icons/io";
import { useGetFavouriteProduct } from '@/network/Common/common'
import { restaurantData } from '@/mocks/common';
import '../Cart/cart.css'
import { useConfig } from '@/network/Common/common';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Product from '../Product/Product';

export default function WishList() {

  const [cartItems, setCartItems] = useState<any>(JSON.parse(localStorage.getItem('cart_items') as any))
  const [config, setConfig] = useState<any>({})
  const [favProducts, setFavProducts] = useState<any>([])
  const [restaurant_id, setRestaurantId] = useState(restaurantData?.restaurant_id)
  const [isWishlist, setIsWishList] = useState<boolean>(false)

  const history = useHistory();

  const getFavouriteProductQuery = useGetFavouriteProduct({
    onSuccess: (response: any) => {
      setFavProducts(response?.data?.products);
    },
  });

  useConfig(
    {
      queryKey: `config${restaurant_id}`,
      onSuccess: (response: any) => {
        setConfig(response?.data)
      },
    },
    restaurant_id
  )
  const RemoveFavouriteProduct = async (id:number) => {
    try {
      const response = await axios.delete(`https://cafescale.com/api/v1/customer/wish-list/remove?product_id=${id}`
      ,  {
        headers: {
          authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      // Check the response status or handle other logic based on the response
      if (response.status === 200) {
        getFavouriteProductQuery.refetch();
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

  return (
    <>
    <ToastContainer/>
    <div className='bg-black'>
      <div className="container mx-auto">
  <div className="shadow-md py-5">
    <div className='row'>
      <div className='col-lg-3'>

      </div>
      <div className="col-lg-6 bg-black px-10 flex-none bg-black h-[100vh] border-2 border-green-500 rounded-lg overflow-auto">
              <div className="flex justify-between border-b pb-8 pt-2">
                <h1 className="font-semibold text-2xl text-white">Favourite List</h1>
                <h2 className="text-2xl text-white">{favProducts?.length} Items</h2>
              </div>
              <div className="flex mt-10 mb-5 justify-between">
                <h3 className="font-semibold text-gray-500 text-xs uppercase w-2/5 text-white">Product Details</h3>
                <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center text-white">Remove</h3>
              </div>
              {
                favProducts?.map((item: any) => {
                  return (
                    <>
                      <div className="flex items-center justify-between -mx-8 px-6 py-5">
                        <div className="flex w-2/5">
                          <div className="w-20">
                            <img className="h-24" src={`${config?.base_urls?.product_image_url}/${item?.image}`} alt="" />
                          </div>
                          <div className="flex flex-col justify-between ml-4 flex-grow">
                            <span className="font-bold text-sm text-white">{item.name}</span>
                            <span className="text-center w-[100px] font-semibold text-lg text-white ">{config?.currency_symbol} { item.price }</span>
                          </div>
                        </div>

                        <RiDeleteBin6Line href="#" className="font-semibold hover:text-red-800 w-1/5 text-gray-500 text-2xl cursor-pointer text-red-500" onClick={()=>RemoveFavouriteProduct(item.id)}/>

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

            <div className='col-lg-3'>

</div>
          </div>


        </div>
      </div>
    </div>
    </>
  )
}

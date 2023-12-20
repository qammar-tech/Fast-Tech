import React, { useState } from 'react';
import { FaAngleLeft, FaChevronRight } from 'react-icons/fa6';
import 'react-toastify/dist/ReactToastify.css';
import { getAllPopularProducts } from '@/network/products/products';
import { restaurantData } from '@/mocks/common';
import { useConfig } from '@/network/Common/common';

const ProductSlider = ({ addProductToCart }: any) => {
  const [popularProducts, setPopularProducts] = useState<any>([]);
  const [config, setConfig] = useState<any>({});

  getAllPopularProducts(
    {
      queryKey: `relatedBeverages_${restaurantData.restaurant_id}`,
      onSuccess: (response: any) => {
        setPopularProducts(response?.data?.products?.slice(0, 4));
      },
    },
    restaurantData.restaurant_id
  );

  useConfig(
    {
      queryKey: `config_${restaurantData.restaurant_id}`,
      onSuccess: (response: any) => {
        setConfig(response?.data);
      },
    },
    restaurantData.restaurant_id
  );

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-white mb-10 text-left">
          Popular <b>Products</b>
        </h2>
      </div>
      <div
        id="myCarousel"
        className="carousel slide"
        data-ride="carousel"
        data-interval={0}
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularProducts?.map((item: any, index: number) => (
                <div key={index} className="border border-success border-green-600 text-white rounded-xl">
                  <div className="overflow-hidden h-40">
                    <img
                      src={`${config?.base_urls?.product_image_url}/${item?.image}`}
                      className="object-cover w-full h-full"
                      alt=""
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold">{item?.name}</h4>
                    <p className="item-price">
                      <span>$ {item?.price}</span>
                    </p>
                    <button
                      className='h-addcart-btn p-2 mt-4'
                      onClick={() => addProductToCart(item)}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;

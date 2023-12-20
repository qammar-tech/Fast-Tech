import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import "../Home/home.css";
import Navbar from '../NavBar/Navbar';
import { restaurantData } from '@/mocks/common';
import ProductSlider from '../ProductSlider/ProductSlider';
import Footer from '../Footer/Footer';
import { getAllProducts } from '@/network/products/products';
import { useConfig } from '@/network/Common/common';
import { toast, ToastContainer } from 'react-toastify';

const Home = () => {
  const history = useHistory();
  const [products, setProducts] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [config, setConfig] = useState<any>({});
  const [localSomething, setLocalSomething] = useState<any>(localStorage.getItem('cart_items'));
  const productsSectionRef = useRef<HTMLDivElement>(null);

  getAllProducts(
    {
      queryKey: `getAllProducrs`,
      onSuccess: (response: any) => {
        console.log('sanbdsibhkdsbh: ', response);
        setProducts(response?.data);
        const categories = response?.data?.map((item: any) => {
          return {
            id: item?.id,
            name: item?.name,
            banner_image: item?.banner_image,
            status: item?.status,
          };
        });

        setCategories(categories);
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

  const addProductToCart = (item: any) => {
    if (!localStorage.getItem('access_token')) {
      return toast.error('You are not logged in.');
    }
    const cartExists = localSomething ? JSON.parse(localSomething) : false;

    const cartItems = cartExists ? [...cartExists?.cart] : [];

    cartItems.push(item);

    localStorage.setItem('cart_items', JSON.stringify({ user_id: localStorage.getItem('user_id'), cart: cartItems }));
    const latestLocalStorage = localStorage.getItem('cart_items');
    setLocalSomething(latestLocalStorage);
  };

  const mapData = (products: any) => {
    return products?.map((product: any, index: number) => (
      <div className="col-lg-6 col-sm-12 col-xs-12 p-4 cursor-pointer" key={index}>
        <div className="h-full p-2 border rounded-xl flex items-center justify-center text-left sm:text-left">
          <div className="flex-grow">
            <h2
              className="text-2xl text-left title-font font-medium text-white text-lg text-white-900"
              onClick={() => history.push(`/product/${product?.id}`)}
            >
              {product?.name}
            </h2>
            <p className="mb-4">{product?.description}</p>
            <p className="mb-2" style={{ color: '#86bd57' }}>
              <span>$ {product?.price}</span>
            </p>
            <button
              className='add-cart-btn-home'
              onClick={(e) => addProductToCart(product)}
            >
              Add to Cart
            </button>
          </div>
          <img
            onClick={() => history.push(`/product/${product?.id}`)}
            alt="team"
            className="flex-shrink-0 rounded-lg w-1/3 h-[100%] object-cover object-center sm:mb-0 "
            src={`${config?.base_urls?.product_image_url}/${product?.image}`}
          />
        </div>
      </div>
    ));
  };

  const scrollToProducts = (categoryId: number) => {
    if (productsSectionRef.current) {
      const categorySection = productsSectionRef.current.querySelector(`[data-category-id="${categoryId}"]`);
      if (categorySection) {
        categorySection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div>
        <Navbar localSomething={localSomething} />
        <div>
          <div className="home-main-secton-1 lg:mt-[6.5%] xl:mt-[6.5%] mt-[23%]">
            <div className="h-line h-[100%]">
              <h1 className='h-line-h1' onClick={() => scrollToProducts(-1)}>
                Join {restaurantData.name} Rewards to get free items when you order here →
              </h1>
            </div>
            <div className="sec3-bar">
              <>
                <nav className="bg-gray-200 border-t-[1px] mb-20 border-b-[1px]  border-gray-500 bg-black py-3">
                  <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ol className=" items-center justify-between list-reset flex text-gray-700">
                      {categories?.map((item: any, index: number) => (
                        <li key={index}>
                          <a href="#" className="hover:text-lime-500" onClick={() => scrollToProducts(item.id)}>
                            {item?.name}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </div>
                </nav>
              </>
            </div>
            <ProductSlider addProductToCart={addProductToCart} />
          </div>
          <div className="h-main-sec3 bg-gray-900 pt-5" ref={productsSectionRef}>
            <section className="text-white body-font">
              <div className="lg:px-5 mx-auto">
                {products?.map((item: any, index: number) => (
                  <div key={index} className="mb-10" data-category-id={item.id}>
                    <h1 className="text-2xl font-medium title-font text-white  ml-4 mb-3">
                      {item?.name}
                    </h1>
                    <div className="row">{mapData(item?.products)}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;

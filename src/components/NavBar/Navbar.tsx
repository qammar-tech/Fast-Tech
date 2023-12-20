import React, { useEffect, useState } from 'react'
import Singup from '../../pages/SignUp/SignUp'
import './navbar.css'
import { useSignIn } from '@/network/auth/auth'
import { useForgetPassword, useVerifyToken, useResetPassword } from '@/network/verify/verify'
import { useAuth } from '@/hooks/AuthContext'
import { Link, useHistory } from 'react-router-dom';
import { restaurantData } from '@/mocks/common'
import Restpassword from '../Rest Password/Restpassword'
import { CgProfile } from "react-icons/cg";
import { FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import navlogo from "./nav-logo.png"
import { toast } from 'react-toastify'
import InputMask from 'react-input-mask';


const Navbar = ({ localSomething }: any) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showrestpassword, setShowrestpassword] = useState(false);
  const [local, setLocalSomething] = useState<any>(localSomething || localStorage.getItem('cart_items'));
  const history = useHistory();
  const { isAuthenticated, login, logout } = useAuth();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email_or_phone: '',
    password: '',
  });

  const changePath = () => {
    setIsLogin(!isLogin);
  };

  const signInMutation = useSignIn();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    console.log({ name, value })

    // Remove spaces, '-', and '()' for the input with name 'email_or_phone'
    const sanitizedValue = name === 'email_or_phone' ? value.replace(/[\s()-]/g, '') : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: sanitizedValue,
    }));
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await signInMutation.mutateAsync({
        ...formData,
        restaurant_id: restaurantData.restaurant_id,
      });

      if (response.status === 200) {
        toast.success('Logged In Successfully.');
        login(response);
        window.location.reload()
      } else {
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      const { response } = error;
      const { data } = response;
      const { errors } = data;

      toast.error(`${errors[0]?.message}`);
    }
  };

  const openrestpass = () => {
    setShowrestpassword(!showrestpassword);
  };

  useEffect(() => {
    const storedToken: any = localStorage.getItem('access_token');
    setToken(storedToken);
  }, [token, logout, login]);

  const logOut = () => {
    logout();
  };

  const goToCheckout = () => {
    if (localSomething && JSON.parse(localSomething)?.cart?.length) {
      history.push('/cart');
    }
  };

  return (
    <>
      <Restpassword />
      <nav className="bg-black dark:bg-gray-900 fixed w-full z-20 lg-h-[23%] top-0 border-b border-gray-200 dark:border-gray-600">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link to="/home" className="flex items-center">
            <img src={navlogo} className="h-16" alt="Flowbite Logo" />
          </Link>

          <div className="items-center justify-between hidden mr-[40%] w-full md:flex md:w-auto md:order-0s" id="navbar-sticky">
            <ul className="flex flex-col p-3 md:p-0 mt-2 font-medium  md:space-x-5 rtl:space-x-reverse md:flex-row  ">
              <li>
                <Link to={"/home"} className="block font-sans py-2 px-1 text-primeColor rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-lime-500 md:p-0 md:dark:hover:text-lime-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Menu</Link>
              </li>
              <li>
                <a href="#" className="block font-sans py-2 px-3 text-primeColor rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-lime-500 md:p-0 md:dark:hover:text-lime-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Orders</a>
              </li>
              <li>
                <a href="#" className="block font-sans py-2 px-3 text-primeColor rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-lime-500 md:p-0 md:dark:hover:text-lime-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
              </li>
              <li>
              </li>
              <li>
                <a href="#" className="block font-sans py-2  text-primeColor rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-lime-500 md:p-0 md:dark:hover:text-lime-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
              </li>
              <li>
              </li>
            </ul>
          </div>

          <div className="flex items-center space-x-4">
            {token ? (
              <>
                <div className="relative">
                  <FaShoppingCart className='text-white text-4xl cursor-pointer' onClick={goToCheckout} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2">{localSomething && JSON.parse(localSomething)?.cart?.length || 0}</span>
                </div>
                <FaHeart className='text-red-500 text-4xl cursor-pointer' onClick={() => history.push('/wishlist')} />
                <CgProfile
                  id="avatarButton"
                  data-dropdown-toggle="userDropdown"
                  data-dropdown-placement="bottom-start"
                  className="w-10 h-10 rounded-full cursor-pointer text-white"
                />
                <div id="userDropdown" className="hidden bg-black divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                  <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    <div>Bonnie Green</div>
                    <div className="font-medium truncate">name@flowbite.com</div>
                  </div>
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
                    <li>
                      <a href='#' className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbarRest" aria-controls="offcanvasDarkNavbarRest" aria-label="Toggle navigation" onClick={openrestpass}>Reset Password</a>
                    </li>
                  </ul>
                  <div className="py-1">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white" onClick={logOut}>Sign out</a>
                  </div>
                </div>
              </>
            ) : (
                <nav className="navbar border-radius-1 cursor-pointer navbar-dark text-center rounded-md bg-lime-500 sidebar-nav login-btn">
                  <div className="container-fluid">
                    <h1
                      className="navbar-toggler text-white font-semibold"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasDarkNavbar"
                      aria-controls="offcanvasDarkNavbar"
                      aria-label="Toggle navigation"
                    >Login
                    </h1>
                    <div
                      className="offcanvas offcanvas-end text-bg-#0D0D0D sidebar "
                      tabIndex={-1}
                      id="offcanvasDarkNavbar"
                      aria-labelledby="offcanvasDarkNavbarLabel"
                    >
                      <div className="offcanvas-header bg-black text-white ">
                        <button
                          type="button"
                          className="btn-close btn-close-green bg-White text-white border-10 z-50  text-4xl font-bold "
                          data-bs-dismiss="offcanvas"
                          aria-label="Close"
                        >x</button>
                      </div>
                      {isLogin ? (
                        <form onSubmit={onSubmit} className='bg-black h-[100%] p-3'>
                          <div className="canvas-h1-div">
                            <h1 className="canvas-h1">Join {restaurantData.name} Rewards, Win $500!</h1>
                          </div>
                          <div className="canvas-phone-div">
                            <h1 className='canvas-phone-h1'>Email or Phone</h1>
                            <InputMask
                              className='canvas-phone-input'
                              mask="+1(999) 999-9999"
                              placeholder='+1 (555) 555-5555'
                              type="text"
                              name="email_or_phone"
                              onChange={handleChange}
                            />
                              <div className="mt-3 mb-5">
                            <h1 className='canvas-phone-h12'>Password</h1>
                            <input
                              className='canvas-phone-input'
                              placeholder='********'
                              type="password"
                              name="password"
                              onChange={handleChange} 
                            />
                          </div >
                            <p className='canvas-phone-p1 ml-3'>Don't have an account yet?<button className='canvas-phone-span' onClick={() => changePath()}>Sign up</button></p>
                          </div>
                          <div className='mt-8'>
                            <button className='canvas-footer-btn' type='submit'>Continue</button>
                          </div>

                          {/* <div className="w-[100%] bg-black opacity-80">
                            <div className="container">
                              <div className="row" >
                                <div className="col-lg-4 canvas-footer-h1">
                                  <h1>Earn points with every order</h1>
                                </div>
                                <div className="col-lg-4 canvas-footer-h1" >
                                  <h1>Redeem points for free food</h1>
                                </div>
                                <div className="col-lg-4 canvas-footer-h1" >
                                  <h1>Receive exclusive discounts</h1>
                                </div>
                              </div>
                            </div>
                            <button className='canvas-footer-btn' type='submit'>Continue</button>
                            <h1 className='canvas-footer-heading'>By signing up, you agree to receive email and SMS marketing communications from {restaurantData.name} and our technology partner Owner.com and consent to our Platform Terms and Privacy Policy.</h1>
                          </div> */}
                        </form>
                      ) : (
                        <Singup changePath={changePath} />
                      )}
                    </div>
                  </div>
                </nav>
            )}
          </div>

          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;


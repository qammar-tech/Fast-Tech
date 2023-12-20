import React, { useState } from 'react'
import { useSignUp } from '@/network/auth/auth'
import { useCheckPhone, useVerifyPhone } from '@/network/verify/verify'
import { useAuth } from '@/hooks/AuthContext'
import { useHistory } from 'react-router-dom';
import { restaurantData } from '@/mocks/common';
import InputMask from 'react-input-mask';

type SignUp = {
  changePath: () => void
}
const Singup = ({ changePath }: SignUp) => {



  const [moveotp, setMoveopt] = useState(false);
  const [verify, setVerify] = useState(false);
  const [info, setInfo] = useState(false);
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useHistory()
  const { isAuthenticated, login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState({
    token: ''
  })
  let [formData, setFormData] = useState({
    phone: '',
    email: '',
    f_name: '',
    l_name: '',
    password: '',
    referral_code: '',
  });
  let [phone, setPhone] = useState();

  const signUpMutation = useSignUp()
  const checkPhoneMutation = useCheckPhone()
  const verifyPhone = useVerifyPhone()

  const getotp = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (phone) {
        var response = await checkPhoneMutation.mutateAsync({
          phone,
          restaurant_id: restaurantData.restaurant_id,
        });
      }
      if (response.status === 200) {
        setMoveopt(!moveotp);
        setVerify(!verify);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  }


  const getinfo = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (token) {
        var response = await verifyPhone.mutateAsync({
          phone,
          token: token.token,
        });
      }
      if (response.status === 200) {
        setVerify(!verify);
        setInfo(!info)
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // const handlePhone = (e: any) => {
  //   const { name, value } = e.target;
  //   setPhone(value)
  // };

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {

    // Remove spaces, '-', and '()' for the input with name 'email_or_phone'
    const sanitizedValue : any= e.target.value.replace(/[\s()-]/g, '')
    setPhone(sanitizedValue)
  };

  const handleOtp = (e: any) => {
    const { name, value } = e.target;

    setToken((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      let data = formData

      const response = await signUpMutation.mutateAsync({
        ...formData,
        restaurant_id: restaurantData.restaurant_id,
      });
      if (response.status === 200) {

        login(response);
        // navigate.push('/');
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      // Handle error
      console.log('error', error);
    }
  };
  return (



    <>
      {!moveotp &&

        <form className="offcanvas-body bg-black" onSubmit={getotp}>

          <div className="canvas-h1-div-signup ">

            <h1 className="canvas-h1-signup">Join Brickell Rewards, Win $500!</h1>
          </div>

          <div className="canvas-phone-div-signup ">
            <h1 className='canvas-phone-h1-signup'>Phone</h1>
            {/* <input className='canvas-phone-input-signup' placeholder='+1 (555) 555-5555' type="text"
              name="phone"
              onChange={handlePhone}
            /> */}
            <InputMask
              className='canvas-phone-input'
              mask="+1(999) 999-9999"
              placeholder='+1 (555) 555-5555'
              type="text"
              name="phone"
              onChange={handlePhone}
            />
          </div>

          <button className='canvas-footer-btn-signup' type='submit'>Continue</button>
        </form>
      }

      {
        verify &&

        <form className="offcanvas-body bg-black" onSubmit={getinfo}>

          <div className="canvas-h1-div-signup ">

            <h1 className="canvas-h1-signup">Join {restaurantData.name} Rewards, Win $500!</h1>
          </div>

          <div className="canvas-phone-div-signup-otp">
            <h1 className='canvas-phone-h1-signup-opt p-4'>OTP code</h1>
            <div className="conatiner">
              <div className="row w-65">

                <div className="col-lg-12">
                  <input className='canvas-phone-input-signup-opt p-2' placeholder='' type="number"
                    name="token"
                    onChange={handleOtp}
                  />
                </div>

                {/* <div className="col-lg-3">
                                <input className='canvas-phone-input-signup-opt' placeholder='' type="number"
                                  name="token"
                                  onChange={handleOtp}
                                />
                            </div>

                            <div className="col-lg-3">
                                <input className='canvas-phone-input-signup-opt' placeholder='' type="number"
                                  name="token"
                                  onChange={handleOtp}
                                />
                        </div>

                             <div className="col-lg-3">
                                <input className='canvas-phone-input-signup-opt' placeholder='' type="number"
                                  name="token"
                                  onChange={handleOtp}
                                />
                            </div> */}
              </div>
            </div>
          </div>

          <button className='canvas-footer-btn-signup' type='submit'>Verify</button>
        </form>
      }
      {
        info &&
        <form className="offcanvas-body bg-black" onSubmit={onSubmit}>
          <div className="canvas-h1-div-signup">
            <h1 className="canvas-h1-signup">Join Brickell Rewards, Win $500!</h1>
          </div>
          <div className="canvas-phone-div-signup">
            <h1 className='canvas-phone-h1-signup'>Phone</h1>
            <input className='canvas-phone-input-signup' placeholder='+1 (555) 555-5555' type="text"
              name="phone"
              onChange={handleChange}
            />
          </div>
          <div className="canvas-phone-div2-signup">
            <h1 className='canvas-phone-h12-signup'>Password</h1>
            <input className='canvas-phone-input2-signup' placeholder='0000000' type="text"
              name="password"
              onChange={handleChange}
            />
          </div>
          <div className="canvas-phone-div2-signup-email">
            <h1 className='canvas-phone-h12-signup-email'>Email</h1>
            <input className='canvas-phone-input2-signup-email' placeholder='Your Email' type="text"
              name="email"
              onChange={handleChange}
            />
          </div>
          <div className="canvas-phone-fl-name">
            <div className="container">
              <div className="row">
                <div className="col-lg-6">
                  <h1 className='canvas-phone-fl-name-h1'>First Name</h1>
                  <input className='canvas-phone-fl-name-first' placeholder='First' type="text"
                    name="f_name"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6">
                  <h1 className='canvas-phone-fl-name-h1'>Last Name</h1>
                  <input className='canvas-phone-fl-name-first' placeholder='Last' type="text"
                    name="l_name"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <button className='canvas-footer-btn-signup' type='submit'>Continue</button>
        </form>
      }
    </>







  )
}

export default Singup

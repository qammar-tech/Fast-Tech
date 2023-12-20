import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForgetPassword, useVerifyToken, useResetPassword } from '@/network/verify/verify'
import { useAuth } from '@/hooks/AuthContext'
import { useHistory } from 'react-router-dom';
import { restaurantData } from '@/mocks/common'
import InputMask from 'react-input-mask';


const Restpassword = () => {

  const [moveotp, setMoveopt] = useState(false);
  const [verify, setVerify] = useState(false);
  const [info, setInfo] = useState(false);
  const [loading, setLoading] = useState(false)
  const [email_or_phone, setEmailOrPhone] = useState(false)
  const [reset_token, setResetToken] = useState()
  let [formData, setFormData] = useState({
    password: '',
    confirm_password: '',
    _method: 'put'
  });
  const forgetPassword = useForgetPassword()
  const verifyToken = useVerifyToken()
  const resetPassword = useResetPassword()

  const handlePassword = (e: any) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  var handleverify = (e: any) => {
    const { name, value } = e.target;

    setResetToken(value);
  }

  const handleForget = (e: any) => {
    const { name, value } = e.target;
    const sanitizedValue = name === 'phone' ? value.replace(/[\s()-]/g, '') : value;
    setEmailOrPhone(sanitizedValue);
  };

  const onForget = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await forgetPassword.mutateAsync({
        email_or_phone,
        restaurant_id: restaurantData.restaurant_id,
      });
      if (response.status === 200) {
        setMoveopt(!moveotp);
        setVerify(!verify)
      } else {
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      console.log('error====', error?.response?.data?.errors[0]?.message);
      toast.error(error?.response?.data?.errors[0]?.message)
    }
  };
  const onVerify = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await verifyToken.mutateAsync({
        reset_token,
        email_or_phone,
      });
      if (response.status === 200) {
        setVerify(!verify)
        setInfo(!info)
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  };
  const onPassword = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await resetPassword.mutateAsync({
        ...formData,
        reset_token: reset_token,
        email_or_phone: email_or_phone
      });
      if (response.status === 200) {
        toast("Password Reset Successfully.")
        setVerify(!verify)
        setInfo(!info)
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  };


  return (

    <>
      <ToastContainer />

      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2 mt-1">
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <div className="offcanvas offcanvas-end text-bg-black sidebar"
            tabIndex={-1}
            id="offcanvasDarkNavbarRest"
            aria-labelledby="offcanvasDarkNavbarRestLabel"
          >
            <div className="offcanvas-header bg-black text-white ">

              <button
                type="button"
                className="btn-close btn-close-green bg-White text-white border-10 z-50  text-4xl font-bold "
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              >x</button>
            </div>
            {
              !moveotp &&


              <form className="offcanvas-body bg-black" onSubmit={onForget}>

                <div className="canvas-h1-div-signup ">

                  <h1 className="canvas-h1-signup">Join {restaurantData.name} Rewards, Win $500!</h1>
                </div>

                <div className="canvas-phone-div-signup ">
                  <h1 className='canvas-phone-h1-signup'>Phone</h1>
                  <InputMask
                    className='canvas-phone-input'
                    mask="+1(999) 999-9999"
                    placeholder='+1 (555) 555-5555'
                    type="text"
                    name="phone"
                    onChange={handleForget}
                  />

                </div>

                <button className='canvas-footer-btn-signup mt-0 h-[7%]' type='submit'>Continue</button>

              </form>
            }

            {
              verify &&

              <form className="offcanvas-body bg-black" onSubmit={onVerify}>

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
                          onChange={handleverify}
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
              <form className="offcanvas-body bg-black" onSubmit={onPassword}>

                <div className="canvas-h1-div-signup">
                  <h1 className="canvas-h1-signup">Join Brickell Rewards, Win $500!</h1>
                </div>
                <div className="canvas-phone-div2-signup mt-0 h-[15%]">
                  <h1 className='canvas-phone-h12-signup'>Password</h1>
                  <input className='canvas-phone-input2-signup p-2' placeholder='*********' type="text"
                    name="password"
                    onChange={handlePassword}
                  />
                </div>
                <div className="canvas-phone-div2-signup mt-0 h-[15%]">
                  <h1 className='canvas-phone-h12-signup'>Confirm Password</h1>
                  <input className='canvas-phone-input2-signup p-2' placeholder='*********' type="text"
                    name="confirm_password"
                    onChange={handlePassword}
                  />
                </div>
                <button className='canvas-footer-btn-signup mt-0 h-[7%]' type='submit'>Continue</button>
              </form>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Restpassword

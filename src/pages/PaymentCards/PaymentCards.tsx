import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { restaurantData } from '@/mocks/common';
import { CiCreditCard1 } from "react-icons/ci";
import '../Cart/Cart'
import '../Checkout/checkout.css'
import { usePaymentCard , useGetPaymentCard, useDeletePaymentCard} from '@/network/Common/common'
import { toast, ToastContainer } from 'react-toastify';
import { RiDeleteBin6Line } from 'react-icons/ri';
import InputMask from 'react-input-mask';


export default function PaymentCards() {
  const [address, setAddress] = useState('home')
  const [restaurant_id, setRestaurantId] = useState(restaurantData?.restaurant_id)
  const [paymentCards, setPaymentCards] = useState([])
  const history = useHistory();
  let [formData, setFormData] = useState({
    card_no: '',
    exp_month: '',
    exp_year: '',
    cvc: '',
    card_holder_name: '',
  });
  const [loading, setLoading] = useState(false)
  const paymentCard = usePaymentCard()
  const GetPaymentCard = useGetPaymentCard()
  const deletePaymentCard = useDeletePaymentCard()

  const handleChange = (e:any) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = async (e:any) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await paymentCard.mutateAsync(
        {...formData, card_no: formData.card_no.trim()},
      );
      if (response.status === 200) {
        toast("Card Added Successfully.")
        fetchData()
      }
    } catch (error:any) {
      setLoading(false);
      toast.error(error?.response?.data?.message)
      console.log('error', error?.response?.data?.message);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      let data = formData;

      const response = await GetPaymentCard.mutateAsync(formData);

      if (response.status === 200) {
        const cardsWithoutDefault = response?.data?.filter((card: any) => card?.default_card !== '1')
        setPaymentCards(cardsWithoutDefault);

      }
    } catch (error:any) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
      console.log('error', error?.response?.data?.message);
    }
  };

  useEffect(() => {

    fetchData();

  }, []);

  const deleteCard = async (payment_id:any) => {
    try {
      setLoading(true);

      const response = await deletePaymentCard.mutateAsync({payment_id:payment_id});

      if (response.status === 200) {
        toast("Card Deleted Successfully.")
        fetchData()
        setPaymentCards(response?.data);
      }
    } catch (error:any) {
      setLoading(false);
      toast.error(error?.response?.data?.message?.payment_id[0]);
      console.log('error', error?.response?.data?.message?.payment_id);
    }
  };

  return (
    <>
      <ToastContainer />

    <div className='bg-black'>
      <div className="container mx-auto">
        <div className="shadow-md py-5">
          <div className='row'>
            <div className='col-lg-6 bg-black flex-none bg-black h-[90vh] border-2 border-green-500 rounded-lg'>
                <div className='p-5 row'>
                    {
                      paymentCards?.map((value:any,index)=> (
                        <div className='col-6 mb-4'>
                          <div className={`flex items-center bg-black p-2 w-[250px] h-[70px] border-2 border-green-500 rounded-lg cursor-pointer`}>
                            <CiCreditCard1 className={`text-green-500 text-2xl cursor-pointer`} />
                            <div className='ml-10'>
                              <span className='text-md text-gray-600 '>
                                {value.customer_account}
                                <br />
                                {value.card_no}
                              </span>
                            </div>
                            <RiDeleteBin6Line 
                              onClick={()=> deleteCard(value.payment_id)} 
                              className="ml-10 font-semibold hover:text-red-800 text-gray-500 text-2xl cursor-pointer text-red-500" 
                            />
                          </div>

                        </div>
                      ))
                    }
                  </div>
            </div>
            <div className='col-lg-1'>

            </div>
            <div className='col-lg-5 bg-black flex-none bg-black h-[90vh] border-2 border-green-500 rounded-lg'>

              <div className='flex justify-between p-3'>
                <h1 className="text-xl text-bold text-white ">Add Card</h1>

              </div>
              <form className='grid mb-3' onSubmit={onSubmit}>
                <span className='text-white text-lg mb-1'>Card Number</span>

                <InputMask
                  className='canvas-phone-input coupon-input p-3 text-white mb-3'
                  mask="9999 9999 9999 9999"
                  placeholder='4242 4242 4242 4242'
                  type="text"
                  name="card_no"
                  onChange={handleChange}
                />
                <span className='text-white text-lg mb-1'>Expiry Month</span>
              <input className='coupon-input p-3 text-white mb-3' placeholder='12' type="number"
                  name="exp_month"
                 onChange={handleChange}
                />
                <span className='text-white text-lg mb-1'>Expiry Year</span>
              <input className='coupon-input p-3 text-white mb-3' placeholder='24' type="number"
                  name="exp_year"
                 onChange={handleChange}
                />
                <span className='text-white text-lg mb-1'>CVC</span>
              <input className='coupon-input p-3 text-white mb-3' placeholder='214' type="number"
                  name="cvc"
                 onChange={handleChange}
                />
                <span className='text-white text-lg mb-1'>Card Holder Name</span>
              <input className='coupon-input p-3 text-white mb-3' placeholder='John' type="text"
                  name="card_holder_name"
                 onChange={handleChange}
                />
             <button className='save-btn' type='submit'>Save</button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

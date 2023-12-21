import React, { useEffect, useState } from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link, useHistory } from 'react-router-dom';
import { IoMdAddCircleOutline } from "react-icons/io";
import { usePopularProducts } from '@/network/products/products'
import { useAddAddress, useGetAddress, useGetPaymentCard, useConfig } from '@/network/Common/common'
import { restaurantData } from '@/mocks/common';
import { IoHomeOutline } from "react-icons/io5";
import { CiCreditCard1 } from "react-icons/ci";
import { toast, ToastContainer } from 'react-toastify';
import '../Cart/Cart'
import './checkout.css'
import axios from 'axios';
import { usePlaceOrder } from '@/network/order/order';

export default function Checkout() {
  let [count, setCount] = useState(0);
  let [itemsCount, setItemsCount] = useState(0);
  let [totalCartPrice, setTotalCartPrice] = useState(0);
  const [recommendedSides, setRecommendedSides] = useState([])
  const [address, setAddress] = useState(true)
  const [addresses, setAddresses] = useState<any>([])
  const [todaySlot, setTodaySlot] = useState(true)
  const history = useHistory();
  const [paymentCards, setPaymentCards] = useState<any>([])
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<any>(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState<any>(null);
  const [selectedBranchIndex, setSelectedBranchIndex] = useState<number | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<any>(null);
  const [restaurant_id, setRestaurantId] = useState(restaurantData?.restaurant_id)
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState<any>([])
  const [originLatLong, setOriginLatLong] = useState({})

  const signInMutation = usePlaceOrder()

  const GetPaymentCard = useGetPaymentCard()

  const todayTimeSlots = [
    "Now",
    "05:32-05:34",
    "05:34-05:36",
    "05:36-05:38",
    "05:38-05:40",
    "05:40-05:42",
    "05:42-05:44",
    "05:44-05:46",
    "05:46-05:48",
  ]
  const tomorrowTimeSlots = [
    "05:32-05:34",
    "05:34-05:36",
    "05:36-05:38",
    "05:38-05:40",
    "05:40-05:42",
    "05:42-05:44",
    "05:44-05:46",
    "05:46-05:48",
  ]

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await GetPaymentCard.mutateAsync();

      if (response.status === 200) {
        const cardsWithDefault = response?.data?.filter((card: any) => card?.default_card === '1')

        setPaymentCards(cardsWithDefault);
      }
    } catch (error:any) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
      console.log('error', error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchData(); // Invoke the async function immediately

    // If you have any dependencies, add them to the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  usePopularProducts(
    {
      queryKey: `popularProducts_${restaurant_id}`,
      onSuccess: (response: any) => {
        setRecommendedSides(response.data.products)
        console.log("========== recommended sides", response.data.products);

      },
    },
    restaurantData.restaurant_id
  )

  useGetAddress(
    {
      onSuccess: (response: any) => {
        setAddresses(response.data)

      },
    },
  )

  useConfig(
    {
      queryKey: `config${restaurant_id}`,
      onSuccess: (response: any) => {
        setConfig(response?.data?.branches)
        setOriginLatLong(response?.data?.restaurant_location_coverage)
        console.log("lasjdfljasldfjlsadf",response?.data?.branches);
      },
    },
    restaurant_id
  )

  const calculateDistance = async (value:any) => {
    function haversineDistance(lat1:any, lon1:any, lat2:any, lon2:any) {
      const R = 6371; // Earth radius in kilometers
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in kilometers

      return distance;
    }

    function isWithinRadius(originLatLong:any, customerLocation:any) {
      const { latitude: lat1, longitude: lon1, coverage } = originLatLong;
      const { latitude: lat2, longitude: lon2 } = customerLocation;

      const distance = haversineDistance(lat1, lon1, lat2, lon2);

      return distance <= coverage;
    }

    const customerLocation = {
      latitude: value.latitude,
      longitude: value.longitude,
    };

    const withinRadius = isWithinRadius(originLatLong, customerLocation);

    console.log(withinRadius ? 'Within the radius' : 'Outside the radius');
    toast.error(!withinRadius && 'Cannot dilever at this location')
  };

  const truncateText = (text: string, limit: number) => {
    const words = text.split(' ');
    if (words.length > limit) {
      console.log("words", words, "limit", limit);

      return words.slice(0, limit).join(' ') + '...';
    }
    return text;
  };

  const handleAddressClick = (index: number) => {
    setSelectedAddressIndex(index);
    // You can also perform additional actions when an address is clicked
  };

  const handleCardClick = (index: number) => {
    setSelectedCardIndex(index);
    // You can also perform additional actions when an address is clicked
  };

  const handleBranchClick = (value: any, index: number) => {
    setSelectedBranchIndex(index);
    setSelectedBranchId(value?.id)
    // You can also perform additional actions when an address is clicked
  };

  useEffect(()=>{
    if(config.length < 2){
      setSelectedBranchIndex(0)
      setSelectedBranchId(config[0]?.id)
    }
  },[config,selectedBranchId,selectedBranchIndex])


  const placeOrder = async () => {

    const cart = JSON.parse(localStorage.getItem('cart_items') as any )?.cart?.map((item: any) => {
      return {
        product_id: item?.id,
        price: item?.price,
        discount_amount: item?.discount,
      }
    })

    const order_amount = JSON.parse(localStorage.getItem('totalCheckoutAmount') as any)

    let currentDate = new Date();
    let currentDay = currentDate.getDate();

    if(!todaySlot) {
      currentDate.setDate(currentDay + 1);
    }

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    const res = await signInMutation.mutateAsync({
      order_amount,
      delivery_address_id: addresses[selectedAddressIndex]?.id,
      order_type: "delivery",
      branch_id: selectedBranchId,
      delivery_time: "now",
      delivery_date: `${year}-${month}-${day}`,
      distance: -1.0,
      payment_method: 'stripe',
      total_tax_amount: config?.service_fee_estimated_tax?.toFixed(2),
      payment_id: paymentCards[selectedCardIndex]?.payment_id,
      cart
    })

    if(res?.data?.order_id) {
      localStorage.removeItem('cart_items')
      localStorage.removeItem('totalCheckoutAmount')
  
      toast("Order Placed Successfully.")

      setTimeout(() => {
        history.push('/home')
      }, 3000)
    }else {
      toast.error("Order Cannot Be Placed.")

    }

  }

  return (
    <>
    <ToastContainer/>
    <div className='bg-black'>
      <div className="container mx-auto">
        <div className="shadow-md py-5">
          <div className='row'>
            <div className='col-lg-6 bg-black flex-none bg-black h-[90vh] border-2 border-green-500 rounded-lg'>

              <div className='p-3'>
                <div className="flex justify-between border-b pb-8 pt-2">
                  <h1 className="font-semibold text-2xl text-white">Choose Store</h1>
                  <h2 className="font-semibold text-2xl text-white"></h2>
                </div>
              </div>
              <div className='flex justify-between mb-3'>
                <h1 className="text-xl text-bold text-white ">Delivery Address</h1>

                <button className='coupon-btn p-2' onClick={() => history.push(`/add-address`)}
                >Add +</button>

              </div>
              <div className='row'>

                {
                  addresses?.map((value: any, index: number) => (
                    <div className='col-6'>

                      <div className='flex gap-2 mb-5' onClick={() => {handleAddressClick(index);calculateDistance(value)}}>
                        <div className={`flex items-center ${selectedAddressIndex === index ? 'address' : 'bg-black'}  p-2 w-[300px] h-[90px] border-2 border-green-500 rounded-lg cursor-pointer`}>
                          <IoHomeOutline className={`${selectedAddressIndex === index ? 'text-white' : 'text-green-500'} text-xl cursor-pointer mr-2`} />
                          <span className='text-md text-white w-[200px]'>
                            {truncateText(value.address, 20)}
                          </span>

                        </div>

                      </div>
                    </div>
                  ))
                }
              </div>
              <div>

                <span className='text-bold text-white text-xl'>Preference Time</span>
                <div className='mt-3'>
                  <button 
                    className={`${todaySlot ? 'pref-focus-btn' : 'pref-btn'} p-2`} 
                    onClick={() => setTodaySlot(true)}
                  >
                    Today
                  </button>
                  <button 
                    className={`${!todaySlot ? 'pref-focus-btn' : 'pref-btn'} p-2`}
                    onClick={() => setTodaySlot(false)}
                  >
                    Tomorrow
                  </button>
                </div>
              </div>
              <div>

              </div>
              <div>

                <div className='mt-5 flex w-[100%] overflow-y-auto'>
                  {
                    todaySlot ?
                      todayTimeSlots?.map((value, index) => (
                        <button key={index} className='time-btn' type='submit'>{value}</button>
                      ))
                      :
                      tomorrowTimeSlots?.map((value, index) => (
                        <button key={index} className='time-btn' type='submit'>{value}</button>
                      ))
                  }
                </div>
              </div>
              <div className='p-5 row overflow-x-auto'>
              <span className="text-xl text-bold text-white mb-2">Select Branch</span>
                    {
                      config?.map((value:any,index:any)=>(
                        <div className='col-6'>
                <div 
                  className={`flex items-center bg-black p-2 w-[300px] h-[100px] border-2 border-green-500 rounded-lg cursor-pointer`}
                  onClick={() => handleBranchClick(value,index)}
                >
                  <div className='ml-10'>
                    <span className={`${selectedBranchIndex === index ? 'text-green-500' : 'text-white'} text-md`}>
                      {value.name}
                      <br />
                      {value.address}
                    </span>
                  </div>
                </div>

                  </div>
                      ))
                    }
                  </div>
            </div>
            <div className='col-lg-1'>

            </div>
            <div className='col-lg-5 bg-black flex-none bg-black h-[40vh] border-2 border-green-500 rounded-lg'>

              <div className='flex justify-between p-5'>
                <h1 className="text-xl text-bold text-white ">Payment Method</h1>
                <button className='coupon-btn p-2' onClick={() => history.push(`/edit-payment-cards`)}>Add Card +</button>
              </div>
              <div className='row'>
              {
                paymentCards?.map((value:any, index: number)=>(
                  <div className='col-6 mb-4'>
                    <div className='col-6'>
                      <div 
                        className={`flex items-center bg-black p-2 w-[250px] h-[70px] border-2 border-green-500 rounded-lg cursor-pointer`}
                        onClick={() => handleCardClick(index)}
                      >
                        <CiCreditCard1 className={`${selectedCardIndex === index ? 'text-green-600' : 'bg-black'}  text-2xl cursor-pointer`} />
                        <div className='ml-10'>
                          <span className={`${selectedCardIndex === index ? 'text-green-600' : 'bg-black'}  text-md text-gray-600`}>
                            {value.customer_account}
                            <br />
                            {value.card_no}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }


              </div>
              <button className='ml-2 save-btn p-2' onClick={placeOrder}>Confirm Checkout</button>

            </div>
          </div>
        </div>
      </div>
    </div>
    <ToastContainer />
    </>
  )
}

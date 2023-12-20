import React, { useEffect, useState } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { useAddAddress, useGetAddress } from '@/network/Common/common';
import { restaurantData } from '@/mocks/common';
import { IoHomeOutline } from 'react-icons/io5';
import { CiCreditCard1 } from 'react-icons/ci';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useQuery } from 'react-query';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px'
};


import '../Cart/Cart';
import '../Checkout/checkout.css';

export default function AddAddress() {
  const [addressType, setAddressType] = useState('home');
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [latLong, setLatLong] = useState({});
  const [autoCompleteAddresses, setAutoCompleteAddresses] = useState([]);
  const [restaurant_id, setRestaurantId] = useState(restaurantData?.restaurant_id);
  const [loading, setLoading] = useState(false);
  let [center,setCenter] = useState({
    lat: -3.745,
    lng: -38.523
  })
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    contact_person_number: '',
    floorNumber: '',
    buildingNumber: '',
    contact_person_name: '',
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
console.log("autocomplete", autoCompleteAddresses);

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBP1XagJjNU1ntmiKUZCWoH-Wo0YR7mtOQ"
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map: any) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null)
  }, [])

  const addAddressMutation = useAddAddress();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await addAddressMutation.mutateAsync({
        ...formData,
        address:selectedAddress,
        longitude:center.lng,
        latitiude:center.lat
      });
      if (response.status === 200) {
        toast('Address Added Successfully.');
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.errors[0]?.message);
      console.log('error', error?.response?.data?.errors[0]?.message);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const getCurrentLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevData: any) => ({
            ...prevData,
            address_type: addressType,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    };

    getCurrentLocation();
  }, [addressType]);

  const deleteAddress = async (addressId: any) => {
    try {
      const response = await axios.delete(
        `https://cafescale.com/api/v1/customer/address/delete?address_id=${addressId}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      if (response.status === 200) {
        useGetAddress({
          onSuccess: (response: any) => {
            setAddress(response.data);
          },
        });

        toast('Address deleted successfully');
      } else {
        console.error('Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address', error);
    }
  };

  const truncateText = (text: string, limit: number) => {
    const words = text.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    }
    return text;
  };

  const handleAddressClick = (index: number) => {
    setSelectedAddressIndex(index);
  };

  const handleAutocomplete = (search_text: string) => {
    const apiUrl = 'https://cafescale.com/api/v1/mapapi/place-api-autocomplete';

    axios.get(apiUrl, {
      params: {
        search_text: search_text,
      },
    })
      .then(response => {
        setAutoCompleteAddresses(response.data.predictions);
        // Handle the successful response here
        console.log('Response:', response.data.predictions);
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error);
      });
  }

  const handlePlaceId = (value: any) => {
console.log("=================================", value.description);

    const apiUrl = `https://cafescale.com/api/v1/mapapi/place-api-details?placeid=${value.place_id} `;

    axios.get(apiUrl)
      .then(response => {
        setLatLong(response.data.result.geometry.location);
        setCenter({
          lat: response.data.result.geometry.location.lat,
          lng: response.data.result.geometry.location.lng,
        });
        setSelectedAddress(value.description)
        // Handle the successful response here
        console.log('Response:', response.data.result.geometry.location);
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error);
      });
      setIsDropdownOpen(false);
  }
  console.log("===== latlong======",center);
  console.log("===== selectedAddress ======",selectedAddress);

  return (
    <>
      <ToastContainer />
      <div className="bg-black">
        <div className="container mx-auto">
          <div className="shadow-md py-5">
            <div className="row">
              <div className="col-lg-6 bg-black flex-none bg-black h-[90vh] border-2 border-green-500 rounded-lg">
                <>
                {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
                {/* Add a Marker component with position prop */}
                <Marker position={{ lat: center.lat, lng: center.lng }} />

                {/* Child components, such as markers, info windows, etc. */}
                <></>
              </GoogleMap>
            ) : ""}
                </>
                <div className="p-3">
                  <span className="text-bold text-white text-xl">Label As</span>
                  <div className="mt-3">
                    <button
                      className={`${addressType === 'home' ? 'pref-focus-btn' : 'pref-btn'} p-2`}
                      onClick={() => setAddressType('home')}
                    >
                      Home
                    </button>
                    <button
                      className={`${addressType === 'workplace' ? 'pref-focus-btn' : 'pref-btn'} p-2`}
                      onClick={() => setAddressType('workplace')}
                    >
                      WorkPlace
                    </button>
                    <button
                      className={`${addressType === 'other' ? 'pref-focus-btn' : 'pref-btn'} p-2`}
                      onClick={() => setAddressType('other')}
                    >
                      Other
                    </button>
                  </div>
                </div>
                <div className="row">
                  {address?.map((value: any, index) => (
                    <div className="col-6" key={index}>
                      <div
                        className={`flex gap-2 mb-5 ${selectedAddressIndex === index ? 'address' : 'bg-black'
                          }  p-2 w-[300px] h-[90px] border-2 border-green-500 rounded-lg cursor-pointer`}
                        onClick={() => handleAddressClick(index)}
                      >
                        <IoHomeOutline
                          className={`${selectedAddressIndex === index ? 'text-white' : 'text-green-500'
                            } text-xl cursor-pointer mr-2`}
                        />
                        <span className="text-md text-white w-[200px]">
                          {truncateText(value.address, 20)}
                        </span>
                        <RiDeleteBin6Line
                          onClick={() => deleteAddress(value.id)}
                          className="ml-10 font-semibold hover:text-red-800 text-gray-500 text-2xl cursor-pointer text-red-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-lg-1"></div>
              <form
                className="col-lg-5 bg-black flex-none bg-black h-[90vh] border-2 border-green-500 rounded-lg"
                onSubmit={onSubmit}
              >
                <div className="flex justify-between p-3">
                  <h1 className="text-xl text-bold text-white ">Delivery Address</h1>
                </div>
                <div>
                </div>
                <div className="grid mb-3">
                  <span className="text-white text-lg mb-1">Address</span>
                  <input
                    className="coupon-input p-3 text-white mb-3"
                    placeholder="Street 12 Tollington"
                    type="text"
                    defaultValue={selectedAddress ? selectedAddress : ""}
                    name="address"
                    onClick={(e: any) => {handleAutocomplete(e.target.value);setIsDropdownOpen(!isDropdownOpen)}}
                  />
                <div className="relative">
                  {
                    isDropdownOpen ?
      <select
        multiple
        id="countries_multiple"
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
        focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
          isDropdownOpen ? 'focus:outline-none border-blue-500' : ''
        }`}
      >
        {autoCompleteAddresses.map((value: any, index: number) => (
          <option
            className='cursor-pointer'
            key={index}
            onClick={() => {handlePlaceId(value);setIsDropdownOpen(!isDropdownOpen)}}
          >
            {value.description}
          </option>
        ))}
      </select>:""
                  }
    </div>

                  <span className="text-white text-lg mb-1">Apt/Suite/Floor</span>
                  <input
                    className="coupon-input p-3 text-white mb-3"
                    placeholder="Ex:02"
                    type="text"
                    name="floorNumber"
                    onChange={handleChange}
                  />
                  <span className="text-white text-lg mb-1">Business/Building Name</span>
                  <input
                    className="coupon-input p-3 text-white mb-3"
                    placeholder="Ex:Hotel,School etc"
                    type="text"
                    name="buildingNumber"
                    onChange={handleChange}
                  />

                  <span className="text-white text-lg mb-1">Contact Person Name</span>
                  <input
                    className="coupon-input p-3 text-white mb-3"
                    placeholder="Contact Person Name"
                    type="text"
                    name="contact_person_name"
                    onChange={handleChange}
                  />
                  <span className="text-white text-lg mb-1">Contact Person Number</span>
                  <input
                    className="coupon-input p-3 text-white mb-3"
                    placeholder="Contact Person Number"
                    type="text"
                    name="contact_person_number"
                    onChange={handleChange}
                  />
                  <button className="save-btn" type="submit">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

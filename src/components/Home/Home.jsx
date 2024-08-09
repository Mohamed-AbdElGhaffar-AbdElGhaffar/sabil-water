import React, { useState, useRef, useContext, useEffect } from 'react';
import favicon from '../../Assets/favicon.png';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import LocationPicker from '../LocationPicker/LocationPicker';
import { BaseUrlContext } from '../../Contexts/BaseUrlContext';
import Lottie from 'react-lottie';
import WaterAnimation from '../../Assets/WaterAnimation.json'; 
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
// import 'flag-icon-css/css/flag-icon.min.css'; 

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [manualLocation, setManualLocation] = useState('');
  const [useManualLocation, setUseManualLocation] = useState(true);
  const [location, setLocation] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [permissionStatus, setPermissionStatus] = useState(null);
  const closeButtonRef = useRef(null);

  let {baseUrl} = useContext(BaseUrlContext);

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: WaterAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const handleToggle = () => {
    setIsDarkMode(prevState => !prevState);
  };

  async function getProducts() {
    const currencyParam = currency !== 'USD' ? `?currency=${currency}` : '';
    return await axios.get(`${baseUrl}/api/Product/GetAllProducts${currencyParam}`);
  }

  const { isLoading, isError, data, refetch } = useQuery(['getAllProducts', currency], getProducts, {
    onSuccess: (data) => {
      updateOrderItemsPrices(data.data);
    }
  });

  const updateOrderItemsPrices = (products) => {
    setOrderItems(prevOrderItems => {
      return prevOrderItems.map(item => {
        const product = products.find(product => product.id === item.productId);
        return {
          ...item,
          price: product ? product.price : item.price
        };
      });
    });
  };

  const increaseQuantity = (id, name, price) => {
    const element = document.getElementById(id);
    let value = parseInt(element.innerHTML);
    value += 1;
    element.innerHTML = value;

    setOrderItems(prevItems => {
      const itemIndex = prevItems.findIndex(item => item.productId === id);
      if (itemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[itemIndex].quantity += 1;
        return updatedItems;
      } else {
        return [...prevItems, { productId: id, name, price, quantity: 1 }];
      }
    });
  };

  const decreaseQuantity = (id) => {
    const element = document.getElementById(id);
    let value = parseInt(element.innerHTML);
    if (value > 0) {
      value -= 1;
      element.innerHTML = value;

      setOrderItems(prevItems => {
        const itemIndex = prevItems.findIndex(item => item.productId === id);
        if (itemIndex > -1) {
          const updatedItems = [...prevItems];
          if (updatedItems[itemIndex].quantity > 1) {
            updatedItems[itemIndex].quantity -= 1;
            return updatedItems;
          } else {
            updatedItems.splice(itemIndex, 1);
            return updatedItems;
          }
        }
        return prevItems;
      });
    }
  };


  const fetchLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      setUseManualLocation(true);  // Enable manual location input
      return null;
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUseManualLocation(false); // Disable manual location input
          resolve({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error fetching location:', error);
          setUseManualLocation(true);  // Enable manual location input
          resolve(null);
        }
      );
    });
  };
  
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' })
        .then(permission => {
          setPermissionStatus(permission.state);
          if (permission.state === 'granted') {
            fetchLocation();
          }
          permission.onchange = () => {
            setPermissionStatus(permission.state);
            if (permission.state === 'granted') {
              fetchLocation();
            }
          };
        });
    } else {
      setPermissionStatus('prompt');
    }
  }, []);

  const handleLocationToggle = (e) => {
    if (e.target.checked) {
      fetchLocation();
    } else {
      setUseManualLocation(true);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let finalLocation = location;

      if (!finalLocation && !useManualLocation) {
        const browserLocation = await fetchLocation();
        finalLocation = browserLocation || { lat: 0, lng: 0 };
      }

      // const customerAddress = useManualLocation ? null : `Lat: ${finalLocation.lat}, Lng: ${finalLocation.lng}`;
      const customerNote = useManualLocation ? manualLocation : '';

      await axios.post(`${baseUrl}/api/Order/PlaceOrder`, {
        customerPhoneNumber: "+"+values.phoneNumber,
        latitude: finalLocation?.lat,
        longitude: finalLocation?.lng,
        note:customerNote,
        orderItems: orderItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      });

      toast.success('Order placed successfully!');
      if (closeButtonRef.current) {
        closeButtonRef.current.click();
      }
      resetForm();
      orderItems.forEach(item => {
        const element = document.getElementById(item.productId);
        if (element) {
          element.innerHTML = '0';
        }
      });
      setOrderItems([]);
      setIsFormVisible(false);
      setPhoneNumber('20')
    } catch (error) {
      toast.error('Failed, Please try again.');
      console.log(error);
    } finally {
      setSubmitting(false); // Ensure to reset submitting state
    }
  };

  const handleButtonClick = async () => {
    const backdrop = document.querySelector('.modal-backdrop.fade');
    if (backdrop) {
      backdrop.style.display = 'block';
    }
  };

  const handleLocation = async () => {
    const userLocation = await fetchLocation();
    setLocation(userLocation);
  };

  const calculateTotalPrice = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  useEffect(() => {
    refetch();
  }, [currency, refetch]);

  return (
    <>
      <Toaster />

      <Navbar handleToggle={handleToggle} isDarkMode={isDarkMode} currency={currency} setCurrency={setCurrency} />

      <div className="header">
        <div className="container">
          <div className="aboutCard">
            <h2>Welcome to Sabil Water</h2>
            <p>We care about getting water to more people, allowing our customers, communities, and environment to thrive.</p>
          </div>
        </div>
      </div>

      <div className="products">
        <h2>
          ALL PRODUCTS
          <div className="line"></div>
        </h2>

        <div className="container py-4">
        {(isLoading || isError) ?
          <div className='d-flex justify-content-center align-items-center'>
            <Lottie options={defaultOptions} height={200} width={200} />
          </div>:
          <div className="row">
            {data?.data?.map((item) => (
              <div key={item.id} className="col-md-4 col-lg-3 col-sm-6 mb-4">
                <div className="card">
                  <div className='card-img'>
                    <img src={item.imageUrl} className="card-img-top" alt={item.name} />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <div className="text d-flex flex-column justify-content-end align-items-center">
                      {item.description && (
                        <p className="description">{item.description}</p>
                      )}
                      <p className="card-text">{item.price} {currency}</p>
                      <div className="add d-flex justify-content-center align-items-center">
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => decreaseQuantity(item.id)}>-</button>
                        <span className="itemNumber mx-2" id={item.id}>0</span>
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => increaseQuantity(item.id, item.name, item.price)}>+</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        }
        </div>
        {(isLoading || isError) ?
          '':
          <div className="buy d-flex justify-content-center pb-4">
            <button 
              type="button" 
              className={`btn btn-primary `} 
              data-bs-toggle="modal" 
              data-bs-target="#exampleModalCenter"
              onClick={handleButtonClick}
              disabled={orderItems.length === 0}
            >
              Check Out
            </button>
          </div>
        }
      </div>

      <Footer />

      {/* <!-- Modal --> */}
      <div className="modal fade" id="exampleModalCenter" tabIndex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 id="exampleModalCenterTitle" className="modal-title h5 mb-0 px-2 d-flex align-items-center gap-2 overflow-hidden">
                <img src={favicon} className="logo" alt="logo" />
                <div className="title d-flex flex-column">
                  <span className="fw-bold">Sabil</span>
                  <small>Natural Mineral Water</small>
                </div>
              </h2>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={closeButtonRef} onClick={()=> setIsFormVisible(false)}></button>
            </div>
            <div className="modal-body">
              <div className={!isFormVisible ? '': 'd-none' }>
                <div className='ProductInfo'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <h2>Order Details:</h2>
                    <h2 className='text-dark border-0'> <span className='text-dark'>Total Price:</span> {calculateTotalPrice()} {currency}</h2>
                  </div>
                  <div className='item d-none d-md-flex justify-content-between align-items-center gap-1 pb-1'>
                      <p className='price d-block fw-bold text-center'>Price</p>
                      <p className='name fw-bold text-center'>Title</p>
                      <p className='quantity fw-bold text-center'>Quantity</p>
                      <p className='totalPrice fw-bold text-center'>Subtotal Price</p>
                    </div>
                  {orderItems?.map((item) => (
                    <div key={item.productId} className='item d-block d-md-flex justify-content-between align-items-center gap-1 pb-1'>
                      <p className='price d-none d-md-block text-center'>{item.price} {currency}</p>
                      <p className='name text-center'>{item.name}</p>
                      <p className='price d-block d-md-none text-center'>{item.price} {currency}</p>
                      <p className='quantity text-center '><span className='d-inline d-md-none '>Quantity : </span> {item.quantity}</p>
                      <p className='totalPrice text-center'><span className='d-inline d-md-none '>Subtotal Price : </span>{item.price * item.quantity} {currency}</p>
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" onClick={()=>{
                    handleLocation();
                    setIsFormVisible(true);
                    }}>
                    Next
                  </button>
                </div>
              </div>
              <div className={!isFormVisible ? 'd-none': '' }>
                <div>
                <Formik
                  initialValues={{ phoneNumber: '' }}
                  validationSchema={Yup.object({
                    phoneNumber: Yup.string()
                    .required('Phone number is required')
                    .test('is-valid-phone', 'Invalid phone number', value => /^\+?\d{10,}$/.test(value))
                })}
                  onSubmit={handleSubmit}
                >
                  {({ setFieldValue }) => (
                    <Form>
                      
                      <div className="mb-3">
                        <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                        <PhoneInput
                          country={'eg'}
                          value={phoneNumber}
                          onChange={(value) => {
                            setPhoneNumber(value);
                            setFieldValue('phoneNumber', value);
                          }}
                          inputProps={{
                            name: 'phoneNumber',
                            required: true,
                            autoFocus: true
                          }}
                          inputClass="form-control"
                        />
                        <ErrorMessage name="phoneNumber" component="div" className="text-danger" />
                      </div>
                      {useManualLocation ? (
                        <>
                          <div className="mb-3">
                            <label htmlFor="manualLocation" className="form-label">Manual Location</label>
                            <textarea
                              className="form-control"
                              id="manualLocation"
                              name="manualLocation"
                              rows="3"
                              value={manualLocation}
                              onChange={(e) => setManualLocation(e.target.value)}
                            ></textarea>
                          </div>
                          {(permissionStatus === 'granted' || permissionStatus === 'prompt')?
                            <div className="form-check mb-2 mt-1">
                              <Field
                                type="checkbox"
                                className="form-check-input cursorPointer"
                                id="useMapLocation"
                                name="useMapLocation"
                                checked={!useManualLocation}
                                onChange={handleLocationToggle}
                              />
                              <label className="form-check-label cursorPointer" htmlFor="useMapLocation">
                                Use Map Location
                              </label>
                            </div>
                            : ''
                          }
                        </>
                      ) : (
                        <>
                        <LocationPicker onLocationChange={setLocation} />
                  
                        <div className="form-check mb-2 mt-1">
                          <Field
                            type="checkbox"
                            className="form-check-input cursorPointer"
                            id="useManualLocation"
                            name="useManualLocation"
                            checked={useManualLocation}
                            onChange={(e) => setUseManualLocation(e.target.checked)}
                          />
                          <label className="form-check-label cursorPointer" htmlFor="useManualLocation">
                            Use Manual Location
                          </label>
                        </div>
                        </>
                      )}
                      <div className="modal-footer mt-3">
                        <button type="button" className="btn btn-secondary" onClick={() => setIsFormVisible(false)}>Back</button>
                        <button type="submit" className="btn btn-primary">
                        Check Out
                        </button>
                      </div>
                    </Form>
                  )}  
                </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

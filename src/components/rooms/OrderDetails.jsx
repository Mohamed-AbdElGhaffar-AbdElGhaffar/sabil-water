import {
  AppBar,
  Box,
  Container,
  Dialog,
  IconButton,
  Slide,
  Toolbar,
  Typography,
  Select,
  MenuItem
} from '@mui/material';
import { forwardRef, useContext, useEffect, useState } from 'react';
import { Close } from '@mui/icons-material';
import { useOrderDetails } from '../../Contexts/OrderDetailsContext';
import { Link } from 'react-router-dom';
import MapEmbed from '../MapEmbed/MapEmbed';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BaseUrlContext } from '../../Contexts/BaseUrlContext';
import { useLogin } from '../../Contexts/LoginContext';
import { ProgressBar } from 'react-loader-spinner';


const Transition = forwardRef((props, ref) => {
  return <Slide direction="up" {...props} ref={ref} />;
});

const OrderDetails = () => {
  const { orderDetails, setOrderDetails } = useOrderDetails();
  const [selectedDelivery, setSelectedDelivery] = useState("default");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isAssign, setIsAssign] = useState(orderDetails?.isAssigned);
  const { token } = useLogin();
  const {baseUrl} = useContext(BaseUrlContext);

  useEffect(() => {
    let interval;
    if (orderDetails?.isAssigned) {
      interval = setInterval(async () => {
        const { data } = await axios.get(`${baseUrl}/api/Order/GetOrderById/${orderDetails.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrderDetails(data);
        setIsAssign(true)
        if (!data.isAssigned) {
          clearInterval(interval);
          setIsAssign(false)
        }
      }, 20000);
    }
    return () => clearInterval(interval);
  }, [orderDetails?.isAssigned, baseUrl, token, setOrderDetails]);

  const handleClose = () => {
    setOrderDetails(null);
    setSelectedDelivery("default");
    setIsDisabled(false);
  };
  console.log("orderDetails",orderDetails);

  const handleDelivery = async (event) => {
    const deliveryId = event.target.value;
    setSelectedDelivery(deliveryId);

    if (deliveryId !== "default") {
      try {
        const orderId = orderDetails.id; // Make sure orderDetails has the order ID
        await axios.put(
          `${baseUrl}/api/Order/AssignOrderToDelivery/${orderId}`,
          null,
          {
            params: { deliveryId },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success('Delivery person assigned successfully');
        setIsDisabled(true);
        setIsAssign(true)
      } catch (error) {
        toast.error('Failed to assign delivery person');
        setSelectedDelivery("default");
      }
    }
  };

  const menuProps = {
    PaperProps: {
      style: {
        marginTop: '5px',
      },
    },
  };

  return (
    <Dialog
      fullScreen
      open={Boolean(orderDetails)}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" component="h3" sx={{ ml: 2, flex: 1 }}>
            {orderDetails?.customer?.name}
          </Typography>
          <IconButton color="inherit" onClick={handleClose}>
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ backgroundColor: '#F8F8F8', pt: 2 }}>
        <Container>
          <section className="profile">
            <div className="Body px-0">
              <div className="p-0 p-md-auto">
                <div className="Information m-auto">
                  <h2>Customer Information</h2>
                  <form>
                    <div className="row">
                      {orderDetails?.customer?.name?
                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <label className="control-label" htmlFor="Name">
                            Customer Name
                          </label>
                          <input
                            id="Name"
                            type="text"
                            className="form-control"
                            value={orderDetails?.customer?.name}
                            disabled
                          />
                        </div>
                      </div>
                      :''}
                      {orderDetails?.customer?.email?
                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <label className="control-label" htmlFor="Email">
                            Email
                          </label>
                          <input
                            id="Email"
                            type="email"
                            className="form-control"
                            value={orderDetails?.customer?.email}
                            disabled
                          />
                        </div>
                      </div>
                      :''}
                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <label className="control-label" htmlFor="phone">
                            Phone Number
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            className="form-control"
                            value={orderDetails?.customer?.phoneNumber}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <label className="control-label" htmlFor="orderDate">
                            Order Date
                          </label>
                          <input
                            id="orderDate"
                            type="text"
                            className="form-control"
                            value={moment(orderDetails?.orderDate).format('YYYY/MM/DD h:mm:ss A')}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <label className="control-label" htmlFor="price">
                            Total Price
                          </label>
                          <input
                            id="price"
                            type="text"
                            className="form-control"
                            value={`${orderDetails?.totalPrice} $`}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <label className="control-label" htmlFor="status">
                            Status
                          </label>
                          <input
                            id="status"
                            type="text"
                            className="form-control"
                            value={orderDetails?.orderStatus?.name}
                            disabled
                          />
                        </div>
                      </div>
                      {!isAssign ? <>
                        {orderDetails?.delivery?.firstName?
                        <div className="col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="control-label" htmlFor="status">
                              Delivery
                            </label>
                            <input
                              id="status"
                              type="text"
                              className="form-control"
                              value={`${orderDetails?.delivery?.firstName} ${orderDetails?.delivery?.lastName}`}
                              disabled
                            />
                          </div>
                        </div>
                        :''}
                        {orderDetails?.nearestDeliveries?
                        <div className="col-lg-6 col-md-12">
                          <div className="form-group">
                            <label className="control-label" htmlFor="status">
                              Assign Delivery
                            </label>
                            <Select
                              id="delivery"
                              value={selectedDelivery}
                              onChange={handleDelivery}
                              fullWidth
                              sx={{
                                height: '43.6px',
                                backgroundColor: 'var(--bs-secondary-bg)',
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#A6A6A6',
                                },
                              }}
                              MenuProps={menuProps}
                              disabled={isDisabled}
                            >
                              <MenuItem value="default" hidden>
                                Choose Delivery Man
                              </MenuItem>
                              {orderDetails?.nearestDeliveries?.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                  {item.firstName + ' ' + item.lastName}
                                </MenuItem>
                              ))}
                            </Select>
                          </div>
                        </div>
                        :''}
                      </> :
                        <div className="col-lg-6 col-md-12">
                          <div className="form-group">
                            <label className="control-label" htmlFor="status">
                              Assign Delivery
                            </label>
                            <div className='d-flex justify-content-start align-items-center'>
                              <ProgressBar
                              visible={true}
                              height="80"
                              // width="100%"
                              color="#4fa94d"
                              borderColor="#A6A6A6"
                              ariaLabel="progress-bar-loading"
                              wrapperStyle={{}}
                              wrapperClass=""
                              />
                            </div>
                          </div>
                        </div>
                      }
                      {orderDetails?.note?
                        <div className="col-12">
                          <div className="form-group">
                            <label className="control-label" htmlFor="status">
                              Location
                            </label>
                            <input
                              id="status"
                              type="text"
                              className="form-control"
                              value={orderDetails?.note}
                              disabled
                            />
                          </div>
                        </div>
                      :''}
                      {/* <div className="col-12">
                        <div className="form-group">
                          <label className="control-label" htmlFor="Note">
                            Location Map
                          </label>
                          <div className="map" style={{ height: '400px', width: '100%' }}>
                            <OrderLocationMap latitude={latitude} longitude={longitude} />
                          </div>
                        </div>
                      </div> */}
                      {orderDetails?.longitude && orderDetails?.latitude?
                        <div className="col-12">
                          <div className="form-group">
                            <label className="control-label mb-2" htmlFor="Note">
                              Location Map:
                            </label>
                            <div className="map" style={{ height: '400px', width: '100%' }}>
                              <MapEmbed latitude={orderDetails?.latitude} longitude={orderDetails?.longitude} />
                            </div>
                          </div>
                        </div>
                      :''}
                    </div>
                  </form>
                </div>
                <div className="productsData m-auto">
                  <h2>Products</h2>
                  <div>
                    <div className="row">
                        {orderDetails?.orderItems?.map((item) => (
                          <div key={item.productId} className="col-md-4 col-lg-3 col-sm-6 mb-4">
                            <div className="card-hover">
                              <div className="card-hover__content">
                                <h3 className="card-hover__title">
                                  {item.productName}
                                </h3>
                                <h3 className="card-hover__title">
                                  Price  <i className="fa-solid fa-hand-holding-dollar"></i> : <span>$ {item.unitPrice}</span> 
                                </h3>
                                <h3 className="card-hover__title">
                                  Quantity  <i className="fa-solid fa-cart-plus"></i> : <span>{item.quantity}</span> 
                                </h3>
                                <h3 className="card-hover__title">
                                  Total Price  <i className="fa-solid fa-money-check-dollar"></i>: <span>$ {item.subTotalPrice}</span>
                                </h3>
                    
                                <Link to="" className="card-hover__link">
                                   
                                </Link>
                              </div>
                              <img src={item.iamgeUrl} alt={item.productName} />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Container>
      </Box>
    </Dialog>
  );
};

export default OrderDetails;

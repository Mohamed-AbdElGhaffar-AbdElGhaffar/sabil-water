import {
  Avatar,
  AppBar,
  Box,
  Dialog,
  IconButton,
  Slide,
  Toolbar,
  Typography,
  Modal,
  Select,
  MenuItem
} from '@mui/material';
import { forwardRef, useContext, useMemo, useState } from 'react';
import { Close } from '@mui/icons-material';
import { useOrderDetails } from '../../Contexts/OrderDetailsContext';
import { Link } from 'react-router-dom';
import MapEmbed from '../MapEmbed/MapEmbed';
import moment from 'moment';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useLogin } from '../../Contexts/LoginContext';
import { BaseUrlContext } from '../../Contexts/BaseUrlContext';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import OrdersActions from '../dashboard/orders/OrdersActions';
import { grey } from '@mui/material/colors';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


const Transition = forwardRef((props, ref) => {
  return <Slide direction="up" {...props} ref={ref} />;
});

const getOrderStatuses = async (token, baseUrl) => {
  const { data } = await axios.get(`${baseUrl}/api/OrderStatus/GetAllOrderStatus`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data;
};

const DeliveryInformation = () => {
  const { deliveryDetails, setDeliveryDetails } = useOrderDetails();
  const [selectedImage, setSelectedImage] = useState(null);
  const { token } = useLogin();
  const {baseUrl} = useContext(BaseUrlContext);
  const queryClient = useQueryClient();

  const { data: orderStatuses = [] } = useQuery(['getOrderStatuses', token, baseUrl], () => getOrderStatuses(token, baseUrl), {
    enabled: !!token && !!baseUrl,
  });

  const [pageSize, setPageSize] = useState(6);

  const mutation = useMutation(
    ({ orderId, orderStatusId }) => {
      return axios.put(
        `${baseUrl}/api/Order/UpdateOrderStatus/${orderId}`,
        { orderStatusId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    },
    {
      onSuccess: (data, { orderId, orderStatusId }) => {
        toast.success('Order status updated successfully!');
        setDeliveryDetails(prevDetails => ({
          ...prevDetails,
          deliveryOrders: prevDetails.deliveryOrders.map(order =>
            order.id === orderId
              ? { ...order, orderStatus: orderStatuses.find(status => status.id === orderStatusId) }
              : order
          ),
        }));
      },
      onError: () => {
        toast.error('Error updating order status.');
      },
    }
  );

  const handleStatusOrderChange = (orderId, orderStatusId) => {
    mutation.mutate({ orderId, orderStatusId });
  };

  const columns = useMemo(
    () => [
      { 
        field: 'customerPhoneNumber', 
        headerName: 'Phone Number', 
        width: 140, 
        renderCell: (params) => params.row.customer?.phoneNumber,
        filterable: true,
        valueGetter: (params) => params.row.customer?.phoneNumber
      },
      {
        field: 'totalPrice',
        headerName: 'Total Cost',
        width: 100,
        renderCell: (params) => params.row.totalPrice + " USD",
      },
      { 
        field: 'comment',
        headerName: 'Comment',
        width: 400, 
        renderCell: (params) => params.row.comment
      },
      { 
        field: 'isAccepted',
        headerName: 'Accepted',
        width: 120, 
        renderCell: (params) => params.row.isAccepted?'Accepted':'Rejected',
        filterable: true,
        valueGetter: (params) => params.row.isAccepted?'Accepted':'Rejected'
      },
      {
        field: 'orderDate',
        headerName: 'Order Date',
        width: 200,
        renderCell: (params) =>
          moment(params.row.orderDate).format('YYYY/MM/DD (h:mm:ss A)'),
        filterable: true,
        valueGetter: (params) => moment(params.row.orderDate).format('YYYY/MM/DD (h:mm:ss A)')
      },
      { 
        field: 'orderStatus', 
        headerName: 'Status', 
        width: 180,
        renderCell: (params) => {
          return (
            <Select
              value={params.row.orderStatus.id}
              onChange={(e) => handleStatusOrderChange(params.row.id, e.target.value)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderLeft: 'none',
                  borderRight: 'none',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderLeft: 'none',
                  borderRight: 'none',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderLeft: 'none',
                  borderRight: 'none',
                },
              }}
            >
              {orderStatuses.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {status.name}
                </MenuItem>
              ))}
            </Select>
          );
        },
        filterable: true,
        valueGetter: (params) => params.row.orderStatus?.name
      },
      { field: 'id', hide: true },
      {
        field: 'actions',
        headerName: 'Actions',
        type: 'actions',
        width: 130,
        renderCell: (params) => <OrdersActions {...{ params }} />,
      },
    ],
    [orderStatuses, mutation]
  );

  const handleClose = () => {
    setDeliveryDetails(null);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleModalClose = () => {
    setSelectedImage(null);
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value === 'Active';
    try {
      await axios.put(
        `${baseUrl}/api/Delivery/UpdateDeliveryStatus/${deliveryDetails.id}`,
        { isActive: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Status updated successfully!');
      setDeliveryDetails((prevDetails) => ({
        ...prevDetails,
        isActive: newStatus
      }));
    } catch (error) {
      toast.error('Error updating status.');
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
      open={Boolean(deliveryDetails)}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" component="h3" sx={{ ml: 2, flex: 1 }}>
            {deliveryDetails?.firstName + ' ' +deliveryDetails?.lastName}
          </Typography>
          <IconButton color="inherit" onClick={handleClose}>
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ backgroundColor: '#F8F8F8', pt: 5 }}>
        <div className="container delivery">  
          <div className="row">
            <div className="col-lg-3 col-md-5 col-sm-12">
              <div className="w-100 d-flex justify-content-center p-1 mb-3">
                  <img src={deliveryDetails?.imageUrl} className="w-75 deliveryPhoto" alt={deliveryDetails?.firstName + ' ' +deliveryDetails?.lastName} onClick={() => handleImageClick(deliveryDetails?.imageUrl)} />
              </div>
              <div className="w-100 d-flex justify-content-center p-1">
                  <img src={deliveryDetails?.nationalIdUrl} className="w-75 deliveryPhoto" alt={deliveryDetails?.firstName + ' ' +deliveryDetails?.lastName} onClick={() => handleImageClick(deliveryDetails?.nationalIdUrl)} />
              </div>
            </div>
            <div className="col-lg-9 col-md-7 col-sm-12">
              <section className="profile deliveryInformation">
                <div className="Body px-0 pb-0">
                  <div className="p-0 p-md-auto">
                    <div className="Information m-auto">
                      <h2>Delivery Information</h2>
                      <form>
                        <div className="row">
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                              <label className="control-label" htmlFor="Name">
                                Name
                              </label>
                              <input
                                id="Name"
                                type="text"
                                className="form-control"
                                value={deliveryDetails?.firstName + ' ' +deliveryDetails?.lastName}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                              <label className="control-label" htmlFor="Email">
                                Email
                              </label>
                              <input
                                id="Email"
                                type="email"
                                className="form-control"
                                value={deliveryDetails?.email}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                              <label className="control-label" htmlFor="phone">
                                Phone Number
                              </label>
                              <input
                                id="phone"
                                type="tel"
                                className="form-control"
                                value={deliveryDetails?.phoneNumber}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                              <label className="control-label" htmlFor="price">
                                Number of Orders
                              </label>
                              <input
                                id="price"
                                type="text"
                                className="form-control"
                                value={deliveryDetails?.numOfOrders}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                              <label className="control-label" htmlFor="status">
                                Status
                              </label>
                              <Select
                                id="status"
                                value={deliveryDetails?.isActive ? 'Active' : 'Not Active'}
                                onChange={handleStatusChange}
                                fullWidth
                                sx={{
                                  height: '43.6px',
                                  backgroundColor: 'var(--bs-secondary-bg)',
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#A6A6A6',
                                  },
                                }}
                                MenuProps={menuProps}
                              >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Not Active">Not Active</MenuItem>
                              </Select>
                            </div>
                          </div>
                          {deliveryDetails?.longitude && deliveryDetails?.latitude?
                            <div className="col-12">
                              <div className="form-group">
                                <label className="control-label mb-2" htmlFor="Note">
                                  Location Map:
                                </label>
                                <div className="map" style={{ height: '300px', width: '100%' }}>
                                  <MapEmbed latitude={deliveryDetails?.latitude} longitude={deliveryDetails?.longitude} />
                                </div>
                              </div>
                            </div>
                          :'<h2>There is No Location</h2>'}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
        <div className="container-xxl container-fluid"> 
          <section className="profile deliveryInformation">
            <div className='Body p-0'>
              <div className="Information text-center">
                <h2 className='border-0'>Orders Delivery</h2>
              </div>
            </div>
          </section>
        </div>
        <div className='container-xxl container-fluid mb-5'>
          <Box
            sx={{
              height: 500,
              width: '100%',
            }}
          >
            <Toaster />
            <DataGrid
              columns={columns}
              rows={deliveryDetails?.deliveryOrders || []}
              getRowId={(row) => row.id}
              rowsPerPageOptions={[6, 10, 20]}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              getRowSpacing={(params) => ({
                top: params.isFirstVisible ? 0 : 6,
                bottom: params.isLastVisible ? 0 : 6,
              })}
              sx={{
                [`& .${gridClasses.row}`]: {
                  bgcolor: (theme) =>
                    theme.palette.mode === 'light' ? grey[200] : grey[900],
                },
                '& .MuiDataGrid-virtualScroller': {
                  scrollbarColor: 'dark',
                  '&::-webkit-scrollbar': {
                    width: '12px',
                    height: '12px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: grey[800],
                    borderRadius: '6px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: grey[600],
                  },
                },
                '& p': {
                  margin: 0
                }
              }}
            />
          </Box>
        </div>
      </Box>
      
      <Modal
        open={Boolean(selectedImage)}
        onClose={handleModalClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          component="img"
          src={selectedImage}
          alt="Selected"
          sx={{
            maxWidth: '60%',
            maxHeight: '60%',
            borderRadius: 2,
          }}
        />
      </Modal>
    </Dialog>
  );
};

export default DeliveryInformation;

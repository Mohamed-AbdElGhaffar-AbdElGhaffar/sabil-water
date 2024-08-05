import { useContext, useEffect, useMemo, useState } from 'react';
import { Avatar, Box, Typography, Select, MenuItem } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import moment from 'moment';
import { grey } from '@mui/material/colors';
import OrdersActions from './OrdersActions';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useLogin } from '../../../Contexts/LoginContext';
import { toast, Toaster } from 'react-hot-toast';
import { useLoading } from '../../../Contexts/LoadingContext';
import { BaseUrlContext } from '../../../Contexts/BaseUrlContext';

const getOrders = async (token, baseUrl) => {
  const { data } = await axios.get(`${baseUrl}/api/Order/GetAllOrders`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data;
};

const getOrderStatuses = async (token, baseUrl) => {
  const { data } = await axios.get(`${baseUrl}/api/OrderStatus/GetAllOrderStatus`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data;
};

const Orders = ({ setSelectedLink, link }) => {
  const { token } = useLogin();
  const { showLoading, hideLoading } = useLoading();
  const queryClient = useQueryClient();
  const {baseUrl} = useContext(BaseUrlContext);
  const { data: orders = [], isLoading, isError } = useQuery(['getAllOrders', token, baseUrl], () => getOrders(token, baseUrl), {
    enabled: !!token && !!baseUrl,
  });
  const { data: orderStatuses = [] } = useQuery(['getOrderStatuses', token, baseUrl], () => getOrderStatuses(token, baseUrl), {
    enabled: !!token && !!baseUrl,
  });
  console.log("orders",orders);
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
      onSuccess: () => {
        toast.success('Order status updated successfully!');
        queryClient.invalidateQueries(['getAllOrders', token]);
      },
      onError: () => {
        toast.error('Error updating order status.');
      },
    }
  );

  const handleStatusChange = (orderId, orderStatusId) => {
    mutation.mutate({ orderId, orderStatusId });
  };

  useEffect(() => {
    setSelectedLink(link);
  }, []);

  const columns = useMemo(
    () => [
      {
        field: 'imageUrl',
        headerName: 'Photo',
        width: 120,
        renderCell: (params) => (
          <Avatar src='' variant="rounded" />
        ),
        sortable: false,
        filterable: false,
      },
      {
        field: 'totalPrice',
        headerName: 'Total Cost',
        width: 120,
        renderCell: (params) => '$' + params.row.totalPrice,
      },
      { 
        field: 'customerName',
        headerName: 'Name',
        width: 210, 
        renderCell: (params) => params.row.customer.name,
        filterable: true,
        valueGetter: (params) => params.row.customer?.name
      },
      { 
        field: 'delivery',
        headerName: 'Delivery',
        width: 270 , 
        renderCell: (params) => params.row.delivery?.firstName?`${params.row.delivery?.firstName} ${params.row.delivery?.lastName}`:'',
        filterable: true,
        valueGetter: (params) => params.row.delivery?.firstName+' '+ params.row.delivery?.lastName
      },
      { 
        field: 'customerPhoneNumber', 
        headerName: 'Phone Number', 
        width: 160, 
        renderCell: (params) => params.row.customer.phoneNumber,
        filterable: true,
        valueGetter: (params) => params.row.customer?.phoneNumber
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
              onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
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

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isLoading, showLoading, hideLoading]);
  if (isError) return <Typography>Error loading orders.</Typography>;

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
      }}
    >
      <Toaster />
      <Typography
        variant="h3"
        component="h3"
        sx={{ textAlign: 'center', mt: 3, mb: 3 }}
      >
        Manage Orders
      </Typography>
      <DataGrid
        columns={columns}
        rows={orders}
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
  );
};

export default Orders;

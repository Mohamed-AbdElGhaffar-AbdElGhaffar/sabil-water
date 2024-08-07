import { useContext, useEffect, useMemo, useState } from 'react';
import { Avatar, Box, Typography, Select, MenuItem } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import moment from 'moment';
import { grey } from '@mui/material/colors';
import DeliveryActions from './DeliveryActions';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useLogin } from '../../../Contexts/LoginContext';
import { toast, Toaster } from 'react-hot-toast';
import { useLoading } from '../../../Contexts/LoadingContext';
import { BaseUrlContext } from '../../../Contexts/BaseUrlContext';

const getAllDeliveries = async (token, baseUrl) => {
  const { data } = await axios.get(`${baseUrl}/api/Delivery/GetAllDeliveries`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data;
};

const Delivery = ({ setSelectedLink, link }) => {
  const { token } = useLogin();
  const { showLoading, hideLoading } = useLoading();
  const queryClient = useQueryClient();
  const {baseUrl} = useContext(BaseUrlContext);
  const { data: deliveries = [], isLoading, isError } = useQuery(['getAllDeliveries', token, baseUrl], () => getAllDeliveries(token, baseUrl), {
    enabled: !!token && !!baseUrl,
  });
  const [pageSize, setPageSize] = useState(6);

  const mutation = useMutation(
    ({ deliveryId, isActive }) => {
      return axios.put(
        `${baseUrl}/api/Delivery/UpdateDeliveryStatus/${deliveryId}`,
        { isActive },
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
        toast.success('Delivery updated successfully!');
        queryClient.invalidateQueries(['getAllDeliveries', token]);
      },
      onError: () => {
        toast.error('Error updating delivery status.');
      },
    }
  );

  const handleStatusChange = (deliveryId, isActive) => {
    mutation.mutate({ deliveryId, isActive });
  };

  useEffect(() => {
    setSelectedLink(link);
  }, []);

  const columns = useMemo(
    () => [
      {
        field: 'imageUrl',
        headerName: 'Photo',
        flex: 1,
        minWidth: 80,
        renderCell: (params) => (
          <Avatar src={params.row.imageUrl} variant="rounded" />
        ),
        sortable: false,
        filterable: false
      },
      {
        field: 'nationalCardImage',
        headerName: 'National card',
        flex: 1,
        minWidth: 120,
        renderCell: (params) => (
          <Avatar src={params.row.nationalIdUrl} variant="rounded" />
        ),
        sortable: false,
        filterable: false, 
        cellClassName:'d-flex justify-content-center'
      },
      { 
        field: 'customerName', 
        headerName: 'Name', 
        flex: 1,
        minWidth: 290,
        renderCell: (params) => params.row.firstName +' '+ params.row.lastName ,
        filterable: true,
        valueGetter: (params) => params.row.firstName +' '+ params.row.lastName 
      },
      { field: 'email', headerName: 'Email', flex: 1, minWidth: 300},
      { field: 'phoneNumber', headerName: 'Phone Number', flex: 1, minWidth: 140 },
      { field: 'numOfOrders', headerName: 'Ourders Number', flex: 1, minWidth: 150, cellClassName:'d-flex justify-content-center' },
      { 
        field: 'isActive', 
        headerName: 'Status', 
        flex: 1,
        minWidth: 180,
        renderCell: (params) => {
          return (
            <Select
              value={params.row.isActive ? "Active" : "Not Active"}
              onChange={(e) => handleStatusChange(params.row.id, e.target.value === "Active")}
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
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Not Active">Not Active</MenuItem>
            </Select>
          );
        },
        filterable: true,
        valueGetter: (params) => params.row.isActive?'Active':'Not Active'
      },
      { field: 'id', hide: true },
      {
        field: 'actions',
        headerName: 'Actions',
        type: 'actions',
        flex: 1,
        minWidth: 130,
        renderCell: (params) => <DeliveryActions {...{ params }} />,
      },
    ],
    [mutation]
  );

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isLoading, showLoading, hideLoading]);
  if (isError) return <Typography>Error loading Deliveries Data.</Typography>;

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
        Manage Delivery
      </Typography>
      <DataGrid
        columns={columns}
        rows={deliveries}
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

export default Delivery;

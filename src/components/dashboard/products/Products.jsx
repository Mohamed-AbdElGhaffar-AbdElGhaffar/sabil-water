import { useContext, useEffect, useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Avatar, Box, Button, Typography } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import moment from 'moment';
import { grey } from '@mui/material/colors';
import ProductActions from './ProductActions';
import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { useRoom } from '../../../Contexts/RoomContext';
import { useLoading } from '../../../Contexts/LoadingContext';
import { BaseUrlContext } from '../../../Contexts/BaseUrlContext';

const getProducts = async (baseUrl) => {
  const { data } = await axios.get(`${baseUrl}/api/Product/GetAllProducts`);
  return data;
};

const Products = ({ setSelectedLink, link }) => {
  const { showLoading, hideLoading } = useLoading();
  const queryClient = useQueryClient();
  const {baseUrl} = useContext(BaseUrlContext);
  const { data: products = [], isLoading, isError } = useQuery(['getAllProducts', baseUrl], ()=>getProducts(baseUrl), {
    enabled: !!baseUrl,
  });
  const { setAddProduct } = useRoom();

  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    setSelectedLink(link);
  }, []);

  const handleDeleteProduct = (id) => {
    queryClient.invalidateQueries('getAllProducts');
  };

  const columns = useMemo(
    () => [
      {
        field: 'imageUrl',
        headerName: 'Photo',
        flex: 1,
        minWidth: 70,
        renderCell: (params) => (
          <Avatar src={params.row.imageUrl} variant="rounded" />
        ),
        sortable: false,
        filterable: false,
      },
      {
        field: 'price',
        headerName: 'Cost',
        flex: 1,
        minWidth: 70,
        renderCell: (params) => params.row.price + " USD",
      },
      { field: 'name', headerName: 'Title', flex: 1, minWidth: 260 },
      { field: 'description', headerName: 'Description', flex: 1, minWidth: 620 },
      {
        field: 'createdAt',
        headerName: 'Created At',
        flex: 1,
        minWidth: 230,
        renderCell: (params) =>
          moment(params.row.createdAt).format('YYYY/MM/DD ( h:mm:ss A )'),
        filterable: true,
        valueGetter: (params) => moment(params.row.createdAt).format('YYYY/MM/DD ( h:mm:ss A )')
      },
      { field: 'id', hide: true },
      {
        field: 'actions',
        headerName: 'Actions',
        type: 'actions',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => <ProductActions {...{ params, handleDeleteProduct }} />,
      },
    ],
    []
  );

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isLoading, showLoading, hideLoading]);
  if (isError) return <Typography>Error loading Products.</Typography>;

  return (
    <>
      <Toaster />
      <Box
        sx={{
          height: 500,
          width: '100%',
        }}
      >
        <Typography
          variant="h3"
          component="h3"
          sx={{ textAlign: 'center', mb: 3 }}
        >
          Manage Products
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'start', mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => setAddProduct({})} 
            sx={{ 
              fontWeight: 500
            }}
            startIcon={<AddIcon />}
          >
            Add Product
          </Button>
        </Box>
        <DataGrid
          columns={columns}
          rows={products}
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
    </>
  );
};

export default Products;

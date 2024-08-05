import { FactCheck, AddShoppingCart } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import { useQuery } from 'react-query';
import PieProductsCost from './PieProductsCost';
import TinyProductsCost from './TinyProductsCost';
import { useLogin } from '../../../Contexts/LoginContext';
import { useLoading } from '../../../Contexts/LoadingContext';
import { BaseUrlContext } from '../../../Contexts/BaseUrlContext';

const getProducts = async (baseUrl) => {
  const { data } = await axios.get(`${baseUrl}/api/Product/GetAllProducts`);
  return data;
};

const getOrders = async (token, baseUrl) => {
  const { data } = await axios.get(`${baseUrl}/api/Order/GetAllOrders`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data;
};

const Main = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);
  const { token } = useLogin();
  const { showLoading, hideLoading } = useLoading();
  const {baseUrl} = useContext(BaseUrlContext);

  const { data: products, isLoading: isLoadingProducts } = useQuery(['getAllProducts', baseUrl], () => getProducts(baseUrl), {
    enabled: !!baseUrl,
  });
  const { data: orders, isLoading: isLoadingOrders } = useQuery(['getAllOrders', token, baseUrl], () => getOrders(token, baseUrl), {
    enabled: !!token && !!baseUrl,
  });

  useEffect(() => {
    if (isLoadingProducts || isLoadingOrders) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isLoadingProducts, isLoadingOrders, showLoading, hideLoading]);
  
  return (
    <Box
      sx={{
        display: { xs: 'flex', md: 'grid' },
        gridTemplateColumns: 'repeat(3,1fr)',
        gridAutoRows: 'minmax(100px, auto)',
        gap: 3,
        textAlign: 'center',
        flexDirection: 'column',
      }}
    >
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4">Total Products</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FactCheck sx={{ height: 100, width: 100, opacity: 0.3, mr: 1 }} />
          <Typography variant="h4">{products?.length}</Typography>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4">Total Orders</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AddShoppingCart sx={{ height: 100, width: 100, opacity: 0.3, mr: 1 }} />
          <Typography variant="h4">{orders?.length}</Typography>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 2, gridColumn: 3, gridRow: '1/4' }}>
        <Box>
          <Typography>Recently added Products</Typography>
          <List>
            {products?.slice(0,4).map((product, i) => (
              <Box key={product?.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar alt={product?.name} src={product?.imageUrl} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={product?.name}
                    secondary={`${moment(product?.createdAt).format('YYYY-MM-DD h:mm:ss A')}`}
                  />
                </ListItem>
                {i !== 3 && <Divider variant="inset" />}
              </Box>
            ))}
          </List>
        </Box>
        <Divider sx={{ mt: 3, mb: 3, opacity: 0.7 }} />
        <Box>
          <Typography>Recently added Orders</Typography>
          <List>
            {orders?.slice(0,4).map((order, i) => (
              <Box key={order.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Tooltip title={order?.customer.name || ''}>
                      <Avatar
                        alt={order?.customer.name}
                        src=''
                        variant="rounded"
                      />
                    </Tooltip>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${order.customer.name?order.customer.name+':':''}  ${order?.customer.phoneNumber}`}
                    secondary={`${moment(order?.orderDate).fromNow()}`}
                  />
                </ListItem>
                {i !== 3 && <Divider variant="inset" />}
              </Box>
            ))}
          </List>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 2, gridColumn: '1/3' }}>
        <PieProductsCost products={products}/>
      </Paper>
      <Paper elevation={3} sx={{ p: 2, gridColumn: '1/3' }}>
        <TinyProductsCost products={products}/>
      </Paper>
    </Box>
  );
};

export default Main;

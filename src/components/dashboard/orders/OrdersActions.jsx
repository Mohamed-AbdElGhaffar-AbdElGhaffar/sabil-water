import { Box, IconButton, Tooltip } from '@mui/material';
import { Preview } from '@mui/icons-material';
import axios from 'axios';
import { useLogin } from '../../../Contexts/LoginContext';
import { useOrderDetails } from '../../../Contexts/OrderDetailsContext';
import { BaseUrlContext } from '../../../Contexts/BaseUrlContext';
import { useContext } from 'react';

const OrdersActions = ({ params }) => {
  const { token } = useLogin();
  const { setOrderDetails } = useOrderDetails();
  const {baseUrl} = useContext(BaseUrlContext);

  const handleViewClick = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/Order/GetOrderById/${params.row.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrderDetails(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  return (
    <>
      <Box>
        <Tooltip title="View Order Details">
          <IconButton onClick={handleViewClick}>
            <Preview />
          </IconButton>
        </Tooltip>
      </Box>


    
    </>
  )
}

export default OrdersActions;
import { Box, IconButton, Tooltip } from '@mui/material';
import { Preview } from '@mui/icons-material';
import axios from 'axios';
import { useLogin } from '../../../Contexts/LoginContext';
import { useOrderDetails } from '../../../Contexts/OrderDetailsContext';
import { BaseUrlContext } from '../../../Contexts/BaseUrlContext';
import { useContext } from 'react';

const DeliveryActions = ({ params }) => {
  const { token } = useLogin();
  const { setDeliveryDetails } = useOrderDetails();
  const {baseUrl} = useContext(BaseUrlContext);

  const handleViewClick = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/Delivery/GetDeliveryById/${params.row.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDeliveryDetails(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
    // console.log("DeliveryActions");
  };

  return (
    <>
      <Box>
        <Tooltip title="View Delivery Details">
          <IconButton onClick={handleViewClick}>
            <Preview />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  )
}

export default DeliveryActions;
// ProductActions.js
import { Box, IconButton, Tooltip } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRoom } from '../../../Contexts/RoomContext';
import { useLogin } from '../../../Contexts/LoginContext';
import { useContext } from 'react';
import { BaseUrlContext } from '../../../Contexts/BaseUrlContext';

const ProductActions = ({ params, handleDeleteProduct }) => {
  const { setRoom } = useRoom();
  const { token } = useLogin();
  const {baseUrl} = useContext(BaseUrlContext);

  const DeleteOrder = async (id) => {
    try {
      const { data } = await axios.delete(`${baseUrl}/api/Product/DeleteProduct/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Product deleted successfully!');
      handleDeleteProduct(id);
      return data;
    } catch (error) {
      toast.error('Failed to delete product.');
      console.error(error);
    }
  };

  const handleEditClick = () => {
    // Set the room data from the params in context
    setRoom({
      id: params.row.id,
      name: params.row.name,
      imageUrl: params.row.imageUrl,
      price: params.row.price,
      description: params.row.description
    });
  };

  return (
    <>
      
      <Box>
        <Tooltip title="Edit this product">
          <IconButton onClick={handleEditClick}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete this product">
          <IconButton onClick={() => DeleteOrder(params.row.id)}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );
};

export default ProductActions;

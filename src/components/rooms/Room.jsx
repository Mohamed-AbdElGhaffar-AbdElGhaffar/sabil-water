import {
  AppBar,
  Box,
  Container,
  Dialog,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from '@mui/material';
import { forwardRef, useContext, useState } from 'react';
import { Close } from '@mui/icons-material';
import { useRoom } from '../../Contexts/RoomContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { useLogin } from '../../Contexts/LoginContext';
import { BaseUrlContext } from '../../Contexts/BaseUrlContext';

const Transition = forwardRef((props, ref) => {
  return <Slide direction="up" {...props} ref={ref} />;
});

const Room = () => {
  const { room, setRoom } = useRoom();
  const [imageFile, setImageFile] = useState(null);
  const queryClient = useQueryClient();
  const { token } = useLogin();
  const {baseUrl} = useContext(BaseUrlContext);

  const handleClose = () => {
    setRoom(null);
  };

  const handleProfileUpdate = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setImageFile(files[0]);
      const imageSrc = URL.createObjectURL(files[0]);
      const imagePreviewElement = document.querySelector('.profileImage');
      if (imagePreviewElement) {
        imagePreviewElement.src = imageSrc;
      }
      console.log(imageSrc);
      formik.setFieldValue('file', files[0]);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Title is required'),
    price: Yup.number()
      .typeError('Price must be a number')
      .required('Price is required')
      .positive('Price must be positive'),
    description: Yup.string().required('Description is required'),
    file: Yup.mixed()
      .nullable()
      .test('fileSize', 'File size is too large', value => !value || (value && value.size <= 1024 * 1024))
      .test('fileFormat', 'Unsupported format', value => !value || (value && ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].includes(value.type))),
  });

  const formik = useFormik({
    initialValues: {
      name: room?.name || '',
      price: room?.price || '',
      description: room?.description || '',
      file: null,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('price', values.price);
        formData.append('description', values.description);

        if (imageFile) {
          formData.append('image', imageFile);
        } else if (room?.imageUrl) {
          formData.append('existingImageUrl', room.imageUrl);
        }

        await axios.put(`${baseUrl}/api/Product/UpdateProduct/${room.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        toast.success('Product updated successfully!');
        queryClient.invalidateQueries('getAllProducts');
        handleClose();
      } catch (error) {
        toast.error('Failed to update product.');
        console.error(error);
      }
    },
  });

  const DeleteOrder = async (id) => {
    try {
      const { data } = await axios.delete(`${baseUrl}/api/Product/DeleteProduct/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Product deleted successfully!');
      queryClient.invalidateQueries('getAllProducts');
      handleClose();
      return data;
    } catch (error) {
      toast.error('Failed to delete product.');
      console.error(error);
    }
  };

  return (
    <Dialog
      fullScreen
      open={Boolean(room)}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" component="h3" sx={{ ml: 2, flex: 1 }}>
            {room?.name}
          </Typography>
          <IconButton color="inherit" onClick={handleClose}>
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ backgroundColor: '#F8F8F8', pt: 2 }}>
        <Container>
          <section className="profile">
            <div className="Body">
              <div className="container p-0 p-md-auto">
                <div className="d-flex flex-column align-items-center gap-3 pb-4">
                  <img 
                    src={imageFile ? URL.createObjectURL(imageFile) : room?.imageUrl} 
                    alt="Profile" 
                    className="profileImage" 
                  />
                  <label htmlFor="ProfilePhoto" className="btn btn-primary custom-file-upload">
                    <i className="fa-regular fa-file-image"></i>
                    Update Image
                  </label>
                  <input
                    type="file"
                    id="ProfilePhoto"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleProfileUpdate}
                  />
                  {formik.touched.file && formik.errors.file ? (
                    <div className="text-danger">{formik.errors.file}</div>
                  ) : null}
                </div>
                <div className="Information m-auto">
                  <h2>Update Data</h2>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <label className="control-label" htmlFor="title">Title</label>
                          <input
                            id="title"
                            type="text"
                            className="form-control"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.name && formik.errors.name ? (
                            <div className="text-danger">{formik.errors.name}</div>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <label className="control-label" htmlFor="price">Price</label>
                          <input
                            id="price"
                            type="text"
                            className="form-control"
                            name="price"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.price && formik.errors.price ? (
                            <div className="text-danger">{formik.errors.price}</div>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label className="control-label" htmlFor="Description">Description</label>
                          <textarea
                            className="form-control"
                            name="description"
                            id="Description"
                            cols="30"
                            rows="10"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.description && formik.errors.description ? (
                            <div className="text-danger">{formik.errors.description}</div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end py-3">
                      <button type="button" className="btn Delete-btn d-flex justify-content-center align-items-center mx-2" onClick={() => DeleteOrder(room.id)}>
                        <i className="fa-solid fa-trash-can"></i>
                        Delete account
                      </button>
                      <button type="submit" className="btn btn-save btn-primary">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </Container>
        <Toaster position="bottom-right" />
      </Box>
    </Dialog>
  );
};

export default Room;

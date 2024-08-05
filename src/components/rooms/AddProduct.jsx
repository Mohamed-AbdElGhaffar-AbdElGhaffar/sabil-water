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
import { toast } from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { useLogin } from '../../Contexts/LoginContext';
import defaultImage from '../../Assets/brain.png';
import { BaseUrlContext } from '../../Contexts/BaseUrlContext';

const Transition = forwardRef((props, ref) => {
  return <Slide direction="up" {...props} ref={ref} />;
});

const AddProduct = () => {
  const { addProduct, setAddProduct } = useRoom();
  const [imageFile, setImageFile] = useState(null);
  const queryClient = useQueryClient();
  const { token } = useLogin();
  const {baseUrl} = useContext(BaseUrlContext);

  const handleClose = () => {
    setAddProduct(null);
    formik.resetForm();
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
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Title is required'),
    price: Yup.number().typeError('Price must be a number').required('Price is required').positive('Price must be positive'),
    description: Yup.string().required('Description is required'),
    file: Yup.mixed()
      .required('Image is required')
      .test('fileSize', 'File size is too large', value => value && value.size <= 1024 * 1024) // 1 MB size limit
      .test('fileFormat', 'Unsupported format', value => value && ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].includes(value.type)),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      description: '',
      file: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('price', values.price);
        formData.append('description', values.description);
        if (imageFile) {
          formData.append('image', imageFile);
        }

        await axios.post(`${baseUrl}/api/Product/AddProduct`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Product added successfully!');
        queryClient.invalidateQueries('getAllProducts');
        handleClose();
      } catch (error) {
        toast.error('Failed to add product.');
        console.error(error);
      }
    },
  });

  return (
    <Dialog
      fullScreen
      open={Boolean(addProduct)}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" component="h3" sx={{ ml: 2, flex: 1 }}>
            Add Product
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
                  <img src={defaultImage} alt="product" className="profileImage" />
                  <label htmlFor="ProfilePhoto" className="btn btn-primary custom-file-upload">
                    <i className="fa-regular fa-file-image"></i>
                    Add Image
                  </label>
                  <input
                    type="file"
                    id="ProfilePhoto"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(event) => {
                      handleProfileUpdate(event);
                      formik.setFieldValue('file', event.currentTarget.files[0]);
                    }}
                  />
                  {formik.touched.file && formik.errors.file ? (
                    <div className="text-danger">{formik.errors.file}</div>
                  ) : null}
                </div>
                <div className="Information m-auto">
                  <h2>Add Data</h2>
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
                      <button type="submit" className="btn btn-save btn-primary">Save</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
        </section>
        </Container>
      </Box>
    </Dialog>
  );
};

export default AddProduct;

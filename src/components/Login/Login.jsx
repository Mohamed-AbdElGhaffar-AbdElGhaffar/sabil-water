import { Close, Send } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import { useContext, useRef } from 'react';
import axios from 'axios';
import PasswordField from './PasswordField';
import { useLogin } from '../../Contexts/LoginContext';
import { toast, Toaster } from 'react-hot-toast';
import { BaseUrlContext } from '../../Contexts/BaseUrlContext';

const Login = () => {
  const { login, setLogin, setToken } = useLogin();
  const {baseUrl} = useContext(BaseUrlContext);
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleClose = () => {
    setLogin(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const response = await axios.post(`${baseUrl}/api/Auth/Login`, { email, password });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      toast.success('Login successfully!');
      setLogin(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <Toaster />
      <Dialog open={login} onClose={handleClose}>
        <DialogTitle>
          Login
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={handleClose}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <DialogContentText>
              Please fill your information in the fields below:
            </DialogContentText>
            <TextField
              autoFocus
              margin="normal"
              variant="standard"
              id="email"
              label="Email"
              type="email"
              fullWidth
              inputRef={emailRef}
              required
            />
            <PasswordField {...{ passwordRef }} />
          </DialogContent>
          <DialogActions sx={{ px: '19px' }}>
            <Button type="submit" variant="contained" endIcon={<Send />}>
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Login;

import { Lock } from '@mui/icons-material';
import { Alert, AlertTitle, Button, Container } from '@mui/material';
import React from 'react';
import { useLogin } from '../../Contexts/LoginContext';

const AccessMessage = () => {
  const { setLogin } = useLogin();
  return (
    <Container sx={{ py: 10 }}>
      <Alert severity="error" variant="outlined">
        <AlertTitle>Forbidden Access</AlertTitle>
        Please login to access this page
        <Button
          variant="outlined"
          sx={{ ml: 2 }}
          startIcon={<Lock />}
          onClick={() => setLogin(true)}
        >
          login
        </Button>
      </Alert>
    </Container>
  );
};

export default AccessMessage;
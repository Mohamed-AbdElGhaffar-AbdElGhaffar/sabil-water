import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react';
import { useLoading } from '../../Contexts/LoadingContext';

const Loading = () => {
  const { loading } = useLoading();

  return (
    <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
      <CircularProgress sx={{ color: 'white' }} />
    </Backdrop>
  );
};

export default Loading;

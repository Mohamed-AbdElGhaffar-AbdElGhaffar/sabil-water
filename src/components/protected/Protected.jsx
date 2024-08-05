// Protected.jsx
import React from 'react';
import AccessMessage from './AccessMessage';
import { useLogin } from '../../Contexts/LoginContext';

const Protected = ({ children }) => {
  const { token } = useLogin();
  return token ? children : <AccessMessage />;
};

export default Protected;

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';
import { useLogin } from './LoginContext';
import { BaseUrlContext } from './BaseUrlContext';

const SignalRContext = createContext();

export const useSignalR = () => useContext(SignalRContext);

export const SignalRProvider = ({ children }) => {
  const { token } = useLogin();
  const { baseUrl } = useContext(BaseUrlContext);
  const [connection, setConnection] = useState(null);

  const getOrderDetails = useCallback(async (orderId, setOrderDetails) => {
    const { data } = await axios.get(`${baseUrl}/api/Order/GetOrderById/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setOrderDetails(data);
  }, [baseUrl, token]);

  useEffect(() => {
    const connect = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/OrdersHub`)
      .build();

    connect.start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.error('SignalR Connection Error: ', err));

    setConnection(connect);

    return () => {
      connect.stop();
    };
  }, [baseUrl]);

  const handleAssignOrder = (orderId, setOrderDetails) => {
    if (connection) {
      connection.on('AssignOrder', (assignedOrderId) => {
        if (assignedOrderId === orderId) {
          getOrderDetails(orderId, setOrderDetails);
        }
      });
    }
  };

  return (
    <SignalRContext.Provider value={{ handleAssignOrder }}>
      {children}
    </SignalRContext.Provider>
  );
};
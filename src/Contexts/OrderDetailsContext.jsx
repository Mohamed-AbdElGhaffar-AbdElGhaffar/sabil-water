import { createContext, useContext, useState } from 'react';

const OrderDetailsContext = createContext();

export const OrderDetailsProvider = ({ children }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [deliveryDetails, setDeliveryDetails] = useState(null);

  return (
    <OrderDetailsContext.Provider value={{ orderDetails, setOrderDetails, deliveryDetails, setDeliveryDetails }}>
      {children}
    </OrderDetailsContext.Provider>
  );
};

export const useOrderDetails = () => useContext(OrderDetailsContext);

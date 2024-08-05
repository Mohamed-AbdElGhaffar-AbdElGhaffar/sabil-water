import { createContext, useContext, useState } from 'react';

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [room, setRoom] = useState(null);
  const [addProduct, setAddProduct] = useState(null);

  return (
    <RoomContext.Provider value={{ room, setRoom, addProduct, setAddProduct }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);

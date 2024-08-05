import { createContext, useContext, useEffect, useState } from 'react';

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [login, setLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  return (
    <LoginContext.Provider value={{ login, setLogin, token, setToken }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);

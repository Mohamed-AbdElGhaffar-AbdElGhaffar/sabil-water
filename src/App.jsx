import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './components/Home/Home';
import Layout from './components/Layout/Layout';
import NotFound from './components/NotFound/NotFound';
import Dashboard from './components/dashboard/Dashboard';
import { RoomProvider } from './Contexts/RoomContext';
import { LoginProvider } from './Contexts/LoginContext';
import { OrderDetailsProvider } from './Contexts/OrderDetailsContext';
import { LoadingProvider } from './Contexts/LoadingContext';
import BaseUrlContextProvider from './Contexts/BaseUrlContext';

let routers = createBrowserRouter([
  {path:'',element:<Layout/>,children:[
    {index:true,element:<Home/> },
    {path:"dashboard/*", element: <Dashboard />},
    {path:'*',element:<NotFound/>},
  ]}
])

function App() {
  return <>
    <BaseUrlContextProvider>
      <LoadingProvider>
        <LoginProvider>
          <OrderDetailsProvider>
            <RoomProvider>
              <RouterProvider router={routers} ></RouterProvider>
            </RoomProvider>
          </OrderDetailsProvider>
        </LoginProvider>
      </LoadingProvider>
    </BaseUrlContextProvider>
  </>
}

export default App;

import React from 'react'
import { Outlet } from 'react-router-dom'
import Room from '../rooms/Room'
import OrderDetails from '../rooms/OrderDetails'
import AddProduct from '../rooms/AddProduct'
import Loading from '../Loading/Loading'
import DeliveryInformation from '../rooms/DeliveryInformation'

export default function Layout() {
  return <>
  
    <Outlet/>
    <Room />
    <AddProduct />
    <OrderDetails />
    <DeliveryInformation />
    <Loading />
  </>
}

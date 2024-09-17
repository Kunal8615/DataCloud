import React from 'react'
import MainHeader from './component/mainHeader'
import { Outlet } from 'react-router-dom'


function Layout() {
  return (
    <>
      <div >

      <MainHeader/>
      <Outlet/>
      </div>
      
    </>
  )
}

export default Layout

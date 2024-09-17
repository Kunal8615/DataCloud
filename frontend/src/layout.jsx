import React from 'react'
import MainHeader from './component/mainHeader'
import { Outlet } from 'react-router-dom'


function Layout() {
  return (
    <>
      <div >

      <MainHeader/>
      <Outlet/>
    {console.log("ara hau kuch")}
      </div>
      
    </>
  )
}

export default Layout

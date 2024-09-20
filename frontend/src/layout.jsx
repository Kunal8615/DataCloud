import React from 'react'
import MainHeader from './component/mainHeader'
import { Outlet } from 'react-router-dom'


function Layout() {
  return (
    <>
      <div className="flex">
    <MainHeader className=""/>
    <Outlet className=""/>
</div>

      
    </>
  )
}

export default Layout

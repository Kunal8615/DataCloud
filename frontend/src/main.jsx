import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import File from './pages/File.jsx'
import './index.css'
import Recent from './pages/Recent.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx'
import Layout from './layout.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import UploadForm from './pages/Upload.jsx'
import SignUp from './pages/SignUp.jsx'

const route = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  { 
    path : "/signup",
    element: <SignUp />,
  },
  {
    path: '/layout',
    element: <Layout />,
    children : [
      {
        path : "",
        element : <File/>
      },
      {
        path: "recent",
        element : <Recent/>
      },{
        path: "upload",
        element : <UploadForm/>
      }
      
      
    ]
  }
])




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={route}></RouterProvider>
  </StrictMode>
)

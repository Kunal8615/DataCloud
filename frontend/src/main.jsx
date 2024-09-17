import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import File from './pages/File.jsx'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx'
import Layout from './layout.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
const route = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/layout',
    element: <Layout />,
    children : [
      {
        path : "file",
        element : <File/>
      }
      
    ]
  }
])




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={route}></RouterProvider>
  </StrictMode>
)

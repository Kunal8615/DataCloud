import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { API_URL } from '../constant';
import { Link, useNavigate } from 'react-router-dom';
import bgupload from "../images/bgupload.jpg";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/user/login`, credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Ensures that cookies are sent with the request
      });

      if (response.status !== 200) {
        throw new Error('Login failed! Please check your credentials.');
      }

      console.log('Login successful:');

      navigate('/layout');
    } catch (error) {
      console.error('Error during login:', error.message);
      alert('Login failed! Please check your credentials.');
    }
  };

  return (
    <div className="flex  items-center justify-center min-h-screen bg-slate-900 "  style={{ 
      backgroundImage: `url(${bgupload})`,
      backgroundSize: 'cover ', // or 'cover' based on your preference
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100%',
      height: '100vh', // Full viewport height
      }}>
      <div className="w-full border-gray-200 border-2 max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-blue-950  border-opacity-50 border-2 border-blue-900 bg-slate-200 rounded-xl text-center text-2xl font-bold hover:text-orange-500 ">DataCloud ♾</h2>
       
       <div className='border-2 border-gray-300 p-4 rounded-xl'>

        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="block mb-2 text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={credentials.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
              />
          </div>
          <div className="form-group">
            <label className="block mb-2 text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your Password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
              />
          </div>
          <button type="submit" className="w-full px-4 py-2 text-white bg-blue-900 rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-200">
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don't have an account? <Link to="/signup" className="text-blue-500 font-bold hover:underline">Sign Up</Link>
        </p>
      </div>
              </div>
    </div>
  );
};

export default Login;
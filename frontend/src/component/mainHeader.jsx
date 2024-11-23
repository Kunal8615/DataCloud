import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { API_URL } from '../constant';

const MainHeader = () => {
  const [profileImage, setProfileImage] = useState('');
  const [error, setError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetch(`${API_URL}/user/GetCurrentUser`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch profile image');
        }
        const data = await response.json();
        setProfileImage(data.data.profilePicture);
      } catch (error) {
        console.error('Error fetching profile image:', error);
        setError('Error fetching profile image');
      }
    };

    fetchProfileImage();
  }, []);

  // Handle sign-out
  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      const response = await fetch(`${API_URL}/user/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to sign out');
      }
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Error signing out');
    } finally {
      setIsSigningOut(false);
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex  ">
      {/* Mobile Menu Button */}
      <div className="lg:hidden p-4 fixed z-20 ">
        <button
          onClick={toggleMobileMenu}
          className="text-white hover:text-orange-500 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
            />
          </svg>
        </button>
      </div>

      {/* Sidebar (Vertical Navigation) */}
      <aside
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } lg:block lg:w-64 w-64 h-screen border-r-4 border-yellow-500 bg-slate-800 text-white fixed z-10 transition-all ease-in-out duration-300`}
      >
        <div className="flex flex-col items-center py-4">
          <p className="text-yellow-300 text-2xl font-bold hover:text-orange-500 mb-6">DataCloud ♾</p>

          {/* Profile Picture */}
          {profileImage && (
            <div className="relative mb-4">
              <img
                src={profileImage}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-white"
              />
            </div>
          )}

          {/* Navigation Links */}
          <nav className="w-full px-4">
            <ul className="space-y-4 font-bold">
              <li>
                <NavLink
                  to=""
                  className={({ isActive }) =>
                    `block py-2 px-4 ${isActive ? 'text-green-400' : 'text-white'} hover:text-orange-700`
                  }
                >
                  Your File
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="recent"
                  className={({ isActive }) =>
                    `block py-2 px-4 ${isActive ? 'text-orange-400' : 'text-white'} hover:text-orange-400`
                  }
                >
                  Recent
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="upload"
                  className={({ isActive }) =>
                    `block py-2 px-4 ${isActive ? 'text-orange-400' : 'text-white'} hover:text-orange-400`
                  }
                >
                  Upload
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="search"
                  className={({ isActive }) =>
                    `block py-2 px-4 ${isActive ? 'text-orange-400' : 'text-white'} hover:text-orange-400`
                  }
                >
                  Search
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        {/* Sign-out Button */}
        <div className="mt-auto pb-4 px-4">
          <button
            onClick={handleSignOut}
            className="w-full text-white hover:text-orange-400 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2"
            disabled={isSigningOut}
          >
            {isSigningOut ? 'Signing Out...' : 'Signout'}
          </button>
        </div>
      </aside>

      {/* Main Content (example for responsive) */}
      <div
        className={`w-full lg:ml-48  -600 ml-0 p-6 transition-all ease-in-out duration-300 ${
          isMobileMenuOpen ? 'opacity-50 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Your Main Content Here */}
     
      </div>
    </div>
  );
};

export default MainHeader;

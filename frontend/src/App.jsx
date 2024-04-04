import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

import Login from './pages/login';
import Homepage from './pages/homepage';
import Users from './pages/users';
import Roles from './pages/roles';
import Invoices from './pages/invoices';
import People from './pages/people';
import Company from './pages/company';
import Calendar from './pages/calendar';
import Reporting from './pages/reporting';
import Lost from './pages/lost';
const Logo = './assets/intellimech.svg'

const App = () => {
  const [permissions, setPermissions] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading status

  const checkPermission = (route) => {
    const permission = permissions.find((permission) => permission.route === route);
    return permission ? true : false;
  };

  const checkAuth = async () => {
    const token = Cookies.get('token');
    if (!token) {
      setAuthenticated(false);
      setAuthChecked(true);
      setLoading(false); // Stop loading when authentication check is complete
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/verify`, { headers: { authorization: `Bearer ${token}` } });
      setAuthenticated(true);
      setUser(response.data.user);
      setLoading(false); // Stop loading when authentication check is complete
    } catch (error) {
      console.error(error);
      setAuthenticated(false);
      setLoading(false); // Stop loading even if there's an error during authentication
    } finally {
      setAuthChecked(true);
    }
  };
  
  const ProtectedRoute = ({ element, path }) => {
    useEffect(() => {
      if (!authChecked) {
        checkAuth();
      }
    }, [authChecked]);

    if (loading) {
      // Render loading indicator
      return (
        <div className="flex items-center justify-center h-screen">
          <div role="status" className="text-center">
            <img
              src={Logo}
              alt="Bouncing Image"
              className="animate-bounce w-max text-gray-200 fill-blue-600"
            />
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }

    if (!authChecked) {
      // Authentication check is still in progress, return null or loading indicator
      return null;
    }

    if (!authenticated) {
      Cookies.remove('token');
      return <Navigate to="/login" />;
    }

    const hasPermission = checkPermission(path);

    if (!hasPermission) {
      return <Lost />;
    }

    // Pass user data to the element
    return React.cloneElement(element, { userdata: user });
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      axios.get(process.env.REACT_APP_API_URL + '/user/access', {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      })
        .then((response) => {
          setPermissions(response.data.permissions);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);
    
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<ProtectedRoute element={<Users />} path="/users" />} />
          <Route path="/calendar" element={<ProtectedRoute element={<Calendar />} path="/calendar" />} />
          <Route path="/employees-consultants" element={<ProtectedRoute element={<People />} path="/employees-consultants" />} />
          <Route path="/roles" element={<ProtectedRoute element={<Roles />} path="/roles" />} />
          <Route path="/grants" element={<ProtectedRoute element={<Lost />} path="/grants" />} />
          <Route path="/invoices/passive" element={<ProtectedRoute element={<Invoices type="PassivaSdI"/>} path="/invoices/passive" />} />
          <Route path="/invoices/active" element={<ProtectedRoute element={<Invoices type="AttivaSdI"/>} path="/invoices/active" />} />
          <Route path="/quotation-request" element={<ProtectedRoute element={<Lost />} path="/quotation-request" />} />
          <Route path="/offer" element={<ProtectedRoute element={<Lost />} path="/offer" />} />
          <Route path="/sales-order" element={<ProtectedRoute element={<Lost />} path="/sales-order" />} />
          <Route path="/project" element={<ProtectedRoute element={<Lost />} path="/project" />} />
          <Route path="/reporting" element={<ProtectedRoute element={<Reporting />} path="/reporting" />} />
          <Route path="/homepage" element={<ProtectedRoute element={<Homepage />} path="/homepage" />} />
          <Route path="/company/clients" element={<ProtectedRoute element={<Company type="client" />} path="/company/clients" />} />
          <Route path="/company/suppliers" element={<ProtectedRoute element={<Company type="suppliers" />} path="/company/suppliers" />} />
          <Route path="*" element={<Lost />} />
      </Routes>
    </Router>
  );
}

export default App;

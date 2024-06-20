import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

import Layout from './pages/home';

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
import QuotationRequest from './pages/quotationrequest';
import Analytics from './pages/analytics';
import Offer from './pages/offer';
import SalesOrder from './pages/salesorder';
import Profile from './pages/profile';
import Job from './pages/job';
import Permission from './pages/permissions';
import Settings from './pages/settings';

const Logo = './assets/intellimech.svg'

const App = () => {
  const [permissions, setPermissions] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading status

  const checkPermission = (route) => {
    console.log(permissions);
    const permission = permissions
                        .filter((permission) => permission.actionType == "Read")
                        .find((permission) => permission.route === route);
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

    //filter the permissions for the route
    const permissionroute = permissions.filter((permission) => permission.route === path);

    // Pass user data to the element
    return React.cloneElement(element, { userdata: user, permissions: permissionroute });
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
        <Route path="/homepage" element={<ProtectedRoute element={<Homepage />} path="/homepage" />} /> 
        <Route path="/users" element={<ProtectedRoute element={<Users />} path="/users" />} />
        <Route path="/calendar" element={<ProtectedRoute element={<Calendar />} path="/calendar" />} />
        <Route path="/employees-consultants" element={<ProtectedRoute element={<People />} path="/employees-consultants" />} />
        <Route path="/roles" element={<ProtectedRoute element={<Roles />} path="/roles" />} />
        <Route path="/permission" element={<ProtectedRoute element={<Permission />} path="/permission" />} />
        <Route path="/invoices/passive" element={<ProtectedRoute element={<Invoices type="PassivaSdI"/>} path="/invoices/passive" />} />
        <Route path="/invoices/active" element={<ProtectedRoute element={<Invoices type="AttivaSdI"/>} path="/invoices/active" />} />
        <Route path="/quotation-request" element={<ProtectedRoute element={<QuotationRequest />} path="/quotation-request" />} />
        <Route path="/analytics" element={<ProtectedRoute element={<Analytics />} path="/analytics" />} />
        <Route path="/offer" element={<ProtectedRoute element={<Offer />} path="/offer" />} />
        <Route path="/purchase" element={<ProtectedRoute element={<Offer />} path="/purchase" />} />
        <Route path="/sales-order" element={<ProtectedRoute element={<SalesOrder />} path="/sales-order" />} />
        <Route path="/job" element={<ProtectedRoute element={<Job />} path="/job" />} />
        <Route path="/reporting" element={<ProtectedRoute element={<Reporting />} path="/reporting" />} />
        <Route path="/company/clients" element={<ProtectedRoute element={<Company type="client" />} path="/company/clients" />} />
        <Route path="/company/suppliers" element={<ProtectedRoute element={<Company type="supplier" />} path="/company/suppliers" />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} path="/profile" />} />
        <Route path="/settings" element={<ProtectedRoute element={<Settings />} path="/settings" />} />
        <Route path="*" element={<Lost />} />
      </Routes>
    </Router>
  );
}

export default App;

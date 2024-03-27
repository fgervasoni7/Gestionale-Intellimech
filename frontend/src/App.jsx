import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import Login from './pages/login';
import Homepage from './pages/homepage';
import Users from './pages/users';
import Profile from './pages/profile';
import Roles from './pages/roles';
import Invoices from './pages/invoices';
import People from './pages/people';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/users" element={<Users />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/people" element={<People />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App

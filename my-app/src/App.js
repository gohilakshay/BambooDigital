// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import BrandDetails from './components/BrandDetails';
import ContentGeneration from './components/ContentGeneration';
import ContentList from './components/ContentList';
import Dashboard from './components/Dashboard';
import EditProduct from './components/EditProduct';
import EditBrand from './components/EditBrand';

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/brand-details" element={<BrandDetails />} />
          <Route path="/generate-content" element={<ContentGeneration />} />
          <Route path="/content-list" element={<ContentList />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit-product" element={<EditProduct />} />
          <Route path="/edit-brand" element={<EditBrand />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


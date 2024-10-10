// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [contentList, setContentList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/content-list', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContentList(response.data.content || []);
      } catch (error) {
        console.error('Failed to fetch content list', error);
      }
    };

    fetchContent();
  }, []);

  const handleEdit = (content) => {
    navigate('/brand-details', { state: { brand: content } });
  };
  const handleEditProduct = (brandId, product, productIndex) => {
    navigate('/edit-product', { state: { brand_id: brandId, product_index: productIndex, ...product } });
  };

  const handleDeleteProduct = async (brandId, productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/brand/${brandId}/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh the content list after deletion
      const response = await axios.get('http://localhost:8000/content-list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContentList(response.data.content || []);
    } catch (error) {
      console.error('Failed to delete product', error);
    }
  };

  const handleDeleteBrand = async (brandId) => {
    try {
      const token = localStorage.getItem('token');
      const brand = contentList.find(content => content.brand_id === brandId);
      if (brand.products.length > 0) {
        alert('Please delete all products within the brand before deleting the brand.');
        return;
      }
      await axios.delete(`http://localhost:8000/brand/${brandId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh the content list after deletion
      const response = await axios.get('http://localhost:8000/content-list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContentList(response.data.content || []);
    } catch (error) {
      console.error('Failed to delete brand', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="p-4">
        
      <h1 className="text-2xl mb-4">Dashboard</h1>
      <button onClick={() => navigate('/brand-details')} className="bg-blue-500 text-white p-2 rounded mb-4">
        Add Brand Details
      </button>
      <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded mb-4">
        Logout
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contentList.length > 0 ? (
          contentList.map((content, index) => (
            <div key={index} className="p-4 border rounded">
              <h2 className="text-xl font-bold mb-2">Brand: {content.brand_name}</h2>
              <button onClick={() => handleEdit(content)} className="bg-yellow-500 text-white p-2 rounded mb-2">
                Edit Brand
              </button>
              <button onClick={() => handleDeleteBrand(content.brand_id)} className="bg-red-500 text-white p-2 rounded mb-2">
                Delete Brand
              </button>
              {Array.isArray(content.products) && content.products.length > 0 ? (
                content.products.map((product, idx) => (
                  <div key={idx} className="mb-4">
                    <h3 className="text-lg font-bold">Product: {product.name}</h3>
                    <p>Description: {product.description}</p>
                    <p>Generated Content: {product.generated_content}</p>
                    <button onClick={() => handleEditProduct(content.brand_id, product, idx)} className="bg-yellow-500 text-white p-2 rounded mb-2">
                     Edit Product
                    </button>
                    <button onClick={() => handleDeleteProduct(content.brand_id, idx)} className="bg-red-500 text-white p-2 rounded mb-2">
                      Delete Product
                    </button>
                  </div>
                ))
              ) : (
                <p>No products available</p>
              )}
              {/* <h3 className="text-lg font-bold">Generated Content</h3>
              <p>{content.generated_content}</p>
              <button onClick={() => handleEdit(content)} className="bg-yellow-500 text-white p-2 rounded mb-2">
                Edit Content
              </button> */}
            </div>
          ))
        ) : (
          <p>No content available</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

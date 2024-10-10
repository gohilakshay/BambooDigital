import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function EditBrand() {
  const location = useLocation();
  const { brand_id, brand_name, products } = location.state;
  const [brandName, setBrandName] = useState(brand_name);
  const [productList, setProductList] = useState(products);
  const navigate = useNavigate();

  const handleProductChange = (index, field, value) => {
    const newProducts = [...productList];
    newProducts[index][field] = value;
    setProductList(newProducts);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8000/brand/${brand_id}`, {
        brand_name: brandName,
        products: productList
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save brand details', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Edit Brand</h1>
      <input
        type="text"
        placeholder="Brand Name"
        value={brandName}
        onChange={(e) => setBrandName(e.target.value)}
        className="mb-2 p-2 border rounded w-full"
      />
      {productList.map((product, index) => (
        <div key={index} className="mb-2">
          <input
            type="text"
            placeholder="Product Name"
            value={product.name}
            onChange={(e) => handleProductChange(index, 'name', e.target.value)}
            className="mb-2 p-2 border rounded w-full"
          />
          <textarea
            placeholder="Product Description"
            value={product.description}
            onChange={(e) => handleProductChange(index, 'description', e.target.value)}
            className="mb-2 p-2 border rounded w-full"
          />
        </div>
      ))}
      <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">
        Save
      </button>
      <button onClick={() => navigate('/dashboard')} className="bg-gray-500 text-white p-2 rounded mt-2">
        Cancel
      </button>
    </div>
  );
}

export default EditBrand;

// // export default BrandDetails;
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import ContentGeneration from './ContentGeneration';  // Import the ContentGeneration component

// function BrandDetails() {
//   const [brandName, setBrandName] = useState('');
//   const [products, setProducts] = useState([{ name: '', description: '', generated_content: '' }]);
//   const navigate = useNavigate();

//   const handleAddProduct = () => {
//     setProducts([...products, { name: '', description: '', generated_content: '' }]);
//   };

//   const handleProductChange = (index, field, value) => {
//     const newProducts = [...products];
//     newProducts[index][field] = value;
//     setProducts(newProducts);
//   };

//   const handleGeneratedContent = (index, content) => {
//     const newProducts = [...products];
//     newProducts[index].generated_content = content;
//     setProducts(newProducts);
//   };

//   const handleSubmit = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post('http://localhost:8000/brand-details', {
//         brand_name: brandName,
//         products: products
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       navigate('/dashboard');
//     } catch (error) {
//       console.error('Failed to save brand details', error);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl mb-4">Brand Details</h1>
//       <input
//         type="text"
//         placeholder="Brand Name"
//         value={brandName}
//         onChange={(e) => setBrandName(e.target.value)}
//         className="mb-2 p-2 border rounded w-full"
//       />
//       {products.map((product, index) => (
//         <div key={index} className="mb-2">
//           <input
//             type="text"
//             placeholder="Product Name"
//             value={product.name}
//             onChange={(e) => handleProductChange(index, 'name', e.target.value)}
//             className="mb-2 p-2 border rounded w-full"
//           />
//           <textarea
//             placeholder="Product Description"
//             value={product.description}
//             onChange={(e) => handleProductChange(index, 'description', e.target.value)}
//             className="mb-2 p-2 border rounded w-full"
//           />
//           <ContentGeneration
//             productDescription={product.description}
//             onContentGenerated={(content) => handleGeneratedContent(index, content)}
//           />
//         </div>
//       ))}
//       <button onClick={handleAddProduct} className="bg-green-500 text-white p-2 rounded mb-2">
//         Add Product
//       </button>
//       <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">
//         Submit
//       </button>
//       <button onClick={() => navigate('/dashboard')} className="bg-gray-500 text-white p-2 rounded mt-2">
//         Back to Dashboard
//       </button>
//     </div>
//   );
// }

// export default BrandDetails;
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ContentGeneration from './ContentGeneration';  // Import the ContentGeneration component

function BrandDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [brandId, setBrandId] = useState(null);
  const [brandName, setBrandName] = useState('');
  const [products, setProducts] = useState([{ name: '', description: '', generated_content: '' }]);

  useEffect(() => {
    if (location.state && location.state.brand) {
      const { brand_id, brand_name, products } = location.state.brand;
      setIsEditMode(true);
      setBrandId(brand_id);
      setBrandName(brand_name);
      setProducts(products);
    }
  }, [location.state]);

  const handleAddProduct = () => {
    setProducts([...products, { name: '', description: '', generated_content: '' }]);
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const handleGeneratedContent = (index, content) => {
    const newProducts = [...products];
    newProducts[index].generated_content = content;
    setProducts(newProducts);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = isEditMode
        ? `http://localhost:8000/brand/${brandId}`
        : 'http://localhost:8000/brand-details';

      if (isEditMode) {
        await axios.put(url, {
          brand_name: brandName,
          products: products
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(url, {
          brand_name: brandName,
          products: products
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    //   navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save brand details', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{isEditMode ? 'Edit Brand' : 'Create Brand'}</h1>
      <input
        type="text"
        placeholder="Brand Name"
        value={brandName}
        onChange={(e) => setBrandName(e.target.value)}
        className="mb-2 p-2 border rounded w-full"
      />
      {products.map((product, index) => (
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
          <ContentGeneration
            productDescription={product.description}
            onContentGenerated={(content) => handleGeneratedContent(index, content)}
            initialContent={product.generated_content}  // Pass the initial generated content
          />
        </div>
      ))}
      <button onClick={handleAddProduct} className="bg-green-500 text-white p-2 rounded mb-2">
        Add Product
      </button>
      <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">
        {isEditMode ? 'Update Brand' : 'Create Brand'}
      </button>
      <button onClick={() => navigate('/dashboard')} className="bg-gray-500 text-white p-2 rounded mt-2">
        Back to Dashboard
      </button>
    </div>
  );
}

export default BrandDetails;



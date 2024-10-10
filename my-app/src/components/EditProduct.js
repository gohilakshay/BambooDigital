// // src/components/EditProduct.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useLocation, useNavigate } from 'react-router-dom';

// function EditProduct() {
//   const location = useLocation();
//   const { content } = location.state;
//   const [productName, setProductName] = useState(content.name);
//   const [productDescription, setProductDescription] = useState(content.description);
//   const navigate = useNavigate();

//   const handleSave = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(`http://localhost:8000/brand/${content.brand_id}/product/${content.product_id}`, {
//         name: productName,
//         description: productDescription
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       navigate('/dashboard');
//     } catch (error) {
//       console.error('Failed to save product', error);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl mb-4">Edit Product</h1>
//       <input
//         type="text"
//         placeholder="Product Name"
//         value={productName}
//         onChange={(e) => setProductName(e.target.value)}
//         className="mb-2 p-2 border rounded w-full"
//       />
//       <textarea
//         placeholder="Product Description"
//         value={productDescription}
//         onChange={(e) => setProductDescription(e.target.value)}
//         className="mb-2 p-2 border rounded w-full"
//       />
//       <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">
//         Save
//       </button>
//       <button onClick={() => navigate('/dashboard')} className="bg-gray-500 text-white p-2 rounded mt-2">
//         Cancel
//       </button>
//     </div>
//   );
// }

// export default EditProduct;
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ContentGeneration from './ContentGeneration';  // Import the ContentGeneration component

function EditProduct() {
    const location = useLocation();
    const { brand_id, product_index, name, description, generated_content } = location.state;
    const [productName, setProductName] = useState(name);
    const [productDescription, setProductDescription] = useState(description);
    const [generatedContent, setGeneratedContent] = useState(generated_content || '');
    const navigate = useNavigate();
  
    useEffect(() => {
      setGeneratedContent(generated_content || '');
    }, [generated_content]);
  
    const handleSave = async () => {
      try {
        const token = localStorage.getItem('token');  
        await axios.put(`http://localhost:8000/brand/${brand_id}/product/${product_index}`, {
          name: productName,
          description: productDescription,
          generated_content: generatedContent  // Include the new generated content
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to save product', error);
      }
    };
  
    const handleGeneratedContent = (content) => {
      setGeneratedContent(content);
    };
  
    return (
      <div className="p-4">
        <h1 className="text-2xl mb-4">Edit Product</h1>
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        />
        <textarea
          placeholder="Product Description"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        />
        <ContentGeneration
          productDescription={productDescription}
          onContentGenerated={handleGeneratedContent}
          initialContent={generatedContent}  // Pass the initial generated content
        />
        <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">
          Save
        </button>
        <button onClick={() => navigate('/dashboard')} className="bg-gray-500 text-white p-2 rounded mt-2">
          Cancel
        </button>
        <button onClick={() => navigate('/dashboard')} className="bg-gray-500 text-white p-2 rounded mt-2">
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  export default EditProduct;


// src/components/ContentGeneration.js
// import React, { useState } from 'react';
// import axios from 'axios';

// function ContentGeneration({ productDescription, onContentGenerated }) {
//   const [generatedContent, setGeneratedContent] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [editableContent, setEditableContent] = useState('');
//   const [isContentEditable, setIsContentEditable] = useState(false);

//   const handleGenerateContent = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post('http://localhost:8000/generate-content', {
//         text: productDescription
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const content = response.data.content;
//       setGeneratedContent(content);
//       setEditableContent(content);
//       setIsContentEditable(true);
//       onContentGenerated(content);  // Call the callback with the generated content
//     } catch (error) {
//       console.error('Failed to generate content', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mb-4">
//       <button onClick={handleGenerateContent} className="bg-blue-500 text-white p-2 rounded mb-4">
//         {loading ? 'Generating...' : 'Generate Content'}
//       </button>
//       <textarea
//         value={editableContent}
//         onChange={(e) => setEditableContent(e.target.value)}
//         readOnly={!isContentEditable}
//         className="w-full p-2 border rounded"
//       />
//     </div>
//   );
// }

// export default ContentGeneration;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ContentGeneration({ productDescription, onContentGenerated, initialContent }) {
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [editableContent, setEditableContent] = useState('');
  const [isContentEditable, setIsContentEditable] = useState(false);

  useEffect(() => {
    setGeneratedContent(initialContent || '');
    setEditableContent(initialContent || '');
  }, [initialContent]);

  const handleGenerateContent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/generate-content', {
        text: productDescription
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const content = response.data.content;
      setGeneratedContent(content);
      setEditableContent(content);
      setIsContentEditable(true);
      onContentGenerated(content);  // Call the callback with the generated content
    } catch (error) {
      console.error('Failed to generate content', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <button onClick={handleGenerateContent} className="bg-blue-500 text-white p-2 rounded mb-4">
        {loading ? 'Generating...' : 'Generate Content'}
      </button>
      <textarea
        value={editableContent}
        onChange={(e) => setEditableContent(e.target.value)}
        readOnly={!isContentEditable}
        className="w-full p-2 border rounded"
      />
    </div>
  );
}

export default ContentGeneration;




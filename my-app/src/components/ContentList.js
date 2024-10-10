// src/components/ContentList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ContentList() {
  const [contentList, setContentList] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/content-list', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContentList(response.data.content);
      } catch (error) {
        console.error('Failed to fetch content list', error);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Content List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contentList.map((content, index) => (
          <div key={index} className="p-4 border rounded">
            <p>{content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContentList;

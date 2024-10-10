// src/components/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('registered') === 'true') {
      setSuccess('Registration successful! Please log in.');
    }
  }, [location]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Both email and password are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/token', new URLSearchParams({
        username: email,
        password: password
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
    } catch (error) {
      setError('Login failed. Please check your email and password.');
      console.error('Login failed', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-xs bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl mb-4 text-center font-bold text-gray-700">Login</h1>
        {success && <div className="mb-4 text-green-500 text-center">{success}</div>}
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-2 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type='button' onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded w-full mb-2 hover:bg-blue-600 transition duration-200">
          Login
        </button>
        <button type='button' onClick={() => navigate('/register')} className="bg-gray-500 text-white p-2 rounded w-full hover:bg-gray-600 transition duration-200">
          Register
        </button>
      </div>
    </div>
  );
}

export default Login;


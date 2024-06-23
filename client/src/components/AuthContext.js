import React, { createContext, useState, useEffect } from 'react';
import axios from './axiosConfig';
import { jwtDecode } from 'jwt-decode';
import { useHistory } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        console.error('Invalid token at startup:', error);
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/login', { email, password });
      console.log('Login response:', response);
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      const decodedUser = jwtDecode(access_token);
      setUser(decodedUser);
      history.push('/book-clubs'); 
    } catch (error) {
      console.error('Login error', error);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      await axios.post('/register', { username, email, password });
    } catch (error) {
      console.error('Registration error', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };

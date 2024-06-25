import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from '../axiosConfig';
import { jwtDecode } from 'jwt-decode'; // Correct import
import { useHistory } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Invalid token at startup:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false); // Set loading to false after checking the token
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    history.push('/');
  }, [history]);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await axios.post('/refresh', {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        const decodedUser = jwtDecode(access_token);
        setUser(decodedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      } catch (error) {
        console.error('Error refreshing token:', error);
        logout();
      }
    };

    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp - currentTime < 300) { // refresh if token expires in less than 5 minutes
          refreshToken();
        }
      }
    }, 60000); // check every 1 minute

    return () => clearInterval(interval);
  }, [logout]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/login', { email, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      const decodedUser = jwtDecode(access_token);
      setUser(decodedUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      history.push('/book-clubs'); // Redirect to book clubs page after login
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

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };

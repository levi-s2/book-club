import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from '../axiosConfig';
import { jwtDecode } from 'jwt-decode';
import { useHistory } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return decoded;
      } catch (error) {
        console.error('Invalid token at startup:', error);
        localStorage.removeItem('token');
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(!user);
  const history = useHistory();

  const fetchUser = useCallback(async (token) => {
    try {
      const decoded = jwtDecode(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`/users/${decoded.sub}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    }
    setLoading(false);
  }, [fetchUser]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    history.push('/');
  }, [history]);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await axios.post('/refresh', {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
          },
        });
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        fetchUser(access_token);
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
        if (decodedToken.exp - currentTime < 300) {
          refreshToken();
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [logout, fetchUser]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/login', { email, password });
      const { access_token, refresh_token, user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
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

  const updateUserCreatedClubs = (updatedClubs) => {
    setUser((prevUser) => ({
      ...prevUser,
      created_clubs: updatedClubs,
    }));
  };
  

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUserCreatedClubs }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
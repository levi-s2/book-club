import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../axiosConfig';
import { AuthContext } from './AuthContext';

const BookClubsContext = createContext();

const BookClubsProvider = ({ children }) => {
  const [bookClubs, setBookClubs] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookClubs = async () => {
      if (user) {
        try {
          const response = await axios.get('/book-clubs', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setBookClubs(response.data);
        } catch (error) {
          console.error('Error fetching book clubs:', error);
        }
      }
    };

    fetchBookClubs();
  }, [user]);

  return (
    <BookClubsContext.Provider value={{ bookClubs, setBookClubs }}>
      {children}
    </BookClubsContext.Provider>
  );
};

export { BookClubsContext, BookClubsProvider };

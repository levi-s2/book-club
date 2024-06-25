import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from './axiosConfig';
import { AuthContext } from './AuthContext';

const BookClubsContext = createContext();

const BookClubsProvider = ({ children }) => {
  const [bookClubs, setBookClubs] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookClubs = async () => {
      if (user) {
        try {
          console.log('Fetching book clubs...');
          const response = await axios.get('/book-clubs', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          console.log('Book clubs fetched:', response.data);
          setBookClubs(response.data);
        } catch (error) {
          console.error('Error fetching book clubs:', error);
        }
      }
    };

    fetchBookClubs();
  }, [user]);

  return (
    <BookClubsContext.Provider value={{ bookClubs }}>
      {children}
    </BookClubsContext.Provider>
  );
};

export { BookClubsContext, BookClubsProvider };

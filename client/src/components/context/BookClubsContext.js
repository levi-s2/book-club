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

  const updateBookClub = (updatedClub) => {
    if (updatedClub.deleted) {
      console.log("Deleting club with id:", updatedClub.id);
      setBookClubs((prevClubs) => prevClubs.filter(club => club.id !== updatedClub.id));
    } else {
      setBookClubs((prevClubs) => prevClubs.map(club => club.id === updatedClub.id ? updatedClub : club));
    }
  };

  return (
    <BookClubsContext.Provider value={{ bookClubs, setBookClubs, updateBookClub }}>
      {children}
    </BookClubsContext.Provider>
  );
};

export { BookClubsContext, BookClubsProvider };

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
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

  const fetchClubDetails = useCallback(async (id) => {
    try {
      const response = await axios.get(`/book-clubs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching club details.');
      return null;
    }
  }, []);

  const joinClub = useCallback(async (id) => {
    try {
      const response = await axios.post(`/book-clubs/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error joining club.');
      return null;
    }
  }, []);

  const leaveClub = useCallback(async (id) => {
    try {
      const response = await axios.delete(`/book-clubs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error leaving club.');
      return null;
    }
  }, []);

  const createClub = useCallback(async (newClub) => {
    try {
      const response = await axios.post('/book-clubs', newClub, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBookClubs((prevClubs) => [...prevClubs, response.data.club]);
      return response.data;
    } catch (error) {
      console.error('Error creating book club.');
      throw error;
    }
  }, []);

  const fetchManageClubDetails = useCallback(async (clubId) => {
    try {
      const response = await axios.get(`/manage-club/${clubId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching manage club details.');
      return null;
    }
  }, []);

  const updateCurrentReading = useCallback(async (clubId, bookId) => {
    try {
      const response = await axios.patch(`/manage-club/${clubId}`, {
        action: 'update_current_reading',
        book_id: bookId,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating current reading.');
      throw error;
    }
  }, []);

  const removeMember = useCallback(async (clubId, memberId) => {
    try {
      const response = await axios.patch(`/manage-club/${clubId}`, {
        action: 'remove_member',
        member_id: memberId,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error removing member.');
      throw error;
    }
  }, []);

  const updateGenres = useCallback(async (clubId, genreIds) => {
    try {
      const response = await axios.patch(`/manage-club/${clubId}`, {
        action: 'update_genres',
        genre_ids: genreIds,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating genres.');
      throw error;
    }
  }, []);

  const deleteClub = useCallback(async (clubId) => {
    try {
      const response = await axios.delete(`/manage-club/${clubId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting club.');
      throw error;
    }
  }, []);

  return (
    <BookClubsContext.Provider value={{
      bookClubs, setBookClubs, updateBookClub, fetchClubDetails, joinClub, leaveClub, createClub,
      fetchManageClubDetails, updateCurrentReading, removeMember, updateGenres, deleteClub
    }}>
      {children}
    </BookClubsContext.Provider>
  );
};

export { BookClubsContext, BookClubsProvider };

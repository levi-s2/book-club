import React, { createContext, useState, useEffect } from 'react';
import axios from '../axiosConfig';

const GenresContext = createContext();

const GenresProvider = ({ children }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('/genres');
        setGenres(response.data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  return (
    <GenresContext.Provider value={{ genres }}>
      {children}
    </GenresContext.Provider>
  );
};

export { GenresContext, GenresProvider };

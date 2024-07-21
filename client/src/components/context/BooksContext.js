import React, { createContext, useState, useEffect } from 'react';
import axios from '../axiosConfig';

const BooksContext = createContext();

const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const fetchBooksByGenre = async () => {
      if (selectedGenres.length > 0) {
        try {
          const response = await axios.get('/books', {
            params: { genre_ids: selectedGenres },
          });
          setBooks(response.data);
        } catch (error) {
          console.error('Error fetching books by genre:', error);
        }
      }
    };

    fetchBooksByGenre();
  }, [selectedGenres]);


  return (
    <BooksContext.Provider value={{ books, setSelectedGenres }}>
      {children}
    </BooksContext.Provider>
  );
};

export { BooksContext, BooksProvider };

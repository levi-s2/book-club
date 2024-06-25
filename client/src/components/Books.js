import React, { useEffect, useState } from 'react';
import axios from './axiosConfig';
import BookCard from './BookCard';
import './css/Books.css';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksResponse = await axios.get('/books');
        console.log('Books:', booksResponse.data);
        setBooks(booksResponse.data);
        setFilteredBooks(booksResponse.data);

        const genresResponse = await axios.get('/genres');
        console.log('Genres:', genresResponse.data);
        setGenres(genresResponse.data);

        const authorsResponse = await axios.get('/authors');
        console.log('Authors:', authorsResponse.data);
        setAuthors(authorsResponse.data);
      } catch (error) {
        console.error('Error fetching books, genres, or authors:', error);
      }
    };

    fetchData();
  }, []);

  const filterByGenre = (genreId) => {
    console.log('Filtering by genre ID:', genreId);
    const filtered = books.filter(book => book.genre && book.genre.id === genreId);
    console.log('Filtered books:', filtered);
    setFilteredBooks(filtered);
  };

  const filterByAuthor = (author) => {
    setFilteredBooks(books.filter(book => book.author === author));
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = books.filter(book => book.title.toLowerCase().includes(query));
    setFilteredBooks(filtered);
  };

  return (
    <div className="books-page">
      <div className="sidebar">
        <h2>Genres</h2>
        <ul>
          {genres.map((genre) => (
            <li key={genre.id} onClick={() => filterByGenre(genre.id)}>
              {genre.name}
            </li>
          ))}
        </ul>
        <h2>Authors</h2>
        <ul>
          {authors.map((author) => (
            <li key={author} onClick={() => filterByAuthor(author)}>
              {author}
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by title"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="books-container">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Books;

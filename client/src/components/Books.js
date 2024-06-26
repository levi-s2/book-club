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
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

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

  const filterBooks = (query, genre, author) => {
    let filtered = books;

    if (genre) {
      filtered = filtered.filter(book => book.genre && book.genre.id === genre);
    }

    if (author) {
      filtered = filtered.filter(book => book.author === author);
    }

    if (query) {
      filtered = filtered.filter(book => book.title.toLowerCase().includes(query.toLowerCase()));
    }

    setFilteredBooks(filtered);
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterBooks(query, selectedGenre, selectedAuthor);
  };

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
    filterBooks(searchQuery, genreId, selectedAuthor);
  };

  const handleAuthorClick = (author) => {
    setSelectedAuthor(author);
    filterBooks(searchQuery, selectedGenre, author);
  };

  return (
    <div className="books-page">
      <div className="sidebar">
        <h2>Genres</h2>
        <ul>
          {genres.map((genre) => (
            <li key={genre.id} onClick={() => handleGenreClick(genre.id)}>
              {genre.name}
            </li>
          ))}
        </ul>
        <h2>Authors</h2>
        <ul>
          {authors.map((author) => (
            <li key={author} onClick={() => handleAuthorClick(author)}>
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

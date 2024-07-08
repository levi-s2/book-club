import React, { useContext, useState, useEffect, useCallback } from 'react';
import { BooksContext } from './context/BooksContext';
import { GenresContext } from './context/GenresContext';
import BookCard from './BookCard';
import NavBar from './NavBar';
import './css/Books.css';

const Books = () => {
  const { books } = useContext(BooksContext);
  const { genres } = useContext(GenresContext);
  const [authors, setAuthors] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  useEffect(() => {
    if (books.length > 0) {
      const uniqueAuthors = Array.from(new Set(books.map(book => book.author)));
      setAuthors(uniqueAuthors);
      setFilteredBooks(books);
    }
  }, [books]);

  const filterBooks = useCallback(() => {
    let filtered = books;

    if (selectedGenre) {
      filtered = filtered.filter(book => book.genre && book.genre.id === selectedGenre);
    }

    if (selectedAuthor) {
      filtered = filtered.filter(book => book.author === selectedAuthor);
    }

    if (searchQuery) {
      filtered = filtered.filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    setFilteredBooks(filtered);
  }, [books, selectedGenre, selectedAuthor, searchQuery]);

  useEffect(() => {
    filterBooks();
  }, [filterBooks]);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const handleGenreClick = (genreId) => {
    setSelectedGenre(prevGenre => (prevGenre === genreId ? null : genreId));
  };

  const handleAuthorClick = (author) => {
    setSelectedAuthor(prevAuthor => (prevAuthor === author ? null : author));
  };

  return (
    <div>
      <NavBar />
      <div className="books-page">
        <div className="sidebar">
          <h2>Genres</h2>
          <ul>
            {genres.map((genre) => (
              <li
                key={genre.id}
                onClick={() => handleGenreClick(genre.id)}
                className={selectedGenre === genre.id ? 'selected' : ''}
              >
                {genre.name}
              </li>
            ))}
          </ul>
          <h2>Authors</h2>
          <ul>
            {authors.map((author) => (
              <li
                key={author}
                onClick={() => handleAuthorClick(author)}
                className={selectedAuthor === author ? 'selected' : ''}
              >
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
    </div>
  );
};

export default Books;

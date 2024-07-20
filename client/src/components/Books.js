import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Layout, theme as antdTheme, message } from 'antd';
import { BooksContext } from './context/BooksContext';
import { GenresContext } from './context/GenresContext';
import { AuthContext } from './context/AuthContext'; // Import AuthContext
import BookCard from './BookCard';
import NavBar from './NavBar';
import { ThemeContext } from './context/ThemeContext';
import axios from './axiosConfig';
import './css/Books.css';

const { Content, Sider } = Layout;

const Books = () => {
  const { books } = useContext(BooksContext);
  const { genres } = useContext(GenresContext);
  const { user } = useContext(AuthContext); // Access AuthContext
  const { theme } = useContext(ThemeContext);
  const [authors, setAuthors] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [userBookList, setUserBookList] = useState([]); // State to hold user's book list
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

  const fetchUserBookList = useCallback(async () => {
    try {
      const response = await axios.get('/user/books', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUserBookList(response.data.map(book => book.id));
    } catch (error) {
      console.error('Error fetching user book list:', error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserBookList();
    }
  }, [user, fetchUserBookList]);

  const handleAddToList = async (bookId) => {
    try {
      await axios.post('/user/books', { bookId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      message.success('Book added to list');
      setUserBookList(prevList => [...prevList, bookId]);
    } catch (error) {
      console.error('Error adding book to list:', error);
      message.error('Failed to add book to list');
    }
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = antdTheme.useToken();

  return (
    <div>
      <NavBar />
      <Layout className={`books-page ${theme}`}>
      <Content
        style={{
          padding: '0 48px',
          background: theme === 'dark' ? '#121212' : '#fff', // Ensure background matches the theme
          color: theme === 'dark' ? '#e0e0e0' : '#000', // Ensure text color matches the theme
        }}
      >
        <Layout
          style={{
            padding: '24px 0',
            background: theme === 'dark' ? '#1f1f1f' : colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Sider
            style={{
              background: theme === 'dark' ? '#1f1f1f' : colorBgContainer,
            }}
            width={200}
          >
            <div className={`sidebar ${theme}`}>
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
          </Sider>
          <Content
            style={{
              padding: '0 24px',
              minHeight: 280,
            }}
          >
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
                  <BookCard
                    key={book.id}
                    book={book}
                    theme={theme}
                    handleAddToList={handleAddToList}
                    isInList={userBookList.includes(book.id)}
                  />
                ))}
              </div>
            </div>
          </Content>
        </Layout>
      </Content>
    </Layout>
    </div>
  );  
}

export default Books;

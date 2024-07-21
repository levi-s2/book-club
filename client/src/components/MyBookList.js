import React, { useEffect, useState, useContext } from 'react';
import { Layout, Spin, Card, Button, Rate } from 'antd';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import { ThemeContext } from './context/ThemeContext';
import { AuthContext } from './context/AuthContext';
import './css/MyBookList.css';

const { Content } = Layout;

const MyBookList = () => {
  const { theme } = useContext(ThemeContext);
  const { fetchUserBooks, updateBookRating, removeUserBook } = useContext(AuthContext);
  const [bookList, setBookList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookList = async () => {
      try {
        const books = await fetchUserBooks();
        setBookList(books);
        setLoading(false);
      } catch (error) {
        setError('Error fetching book list.');
        setLoading(false);
      }
    };

    fetchBookList();
  }, [fetchUserBooks]);

  const handleStarClick = async (nextValue, bookId) => {
    try {
      await updateBookRating(bookId, nextValue);
      setBookList((prevList) =>
        prevList.map((book) =>
          book.id === bookId ? { ...book, rating: nextValue } : book
        )
      );
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const handleRemoveBook = async (bookId) => {
    try {
      await removeUserBook(bookId);
      setBookList((prevList) => prevList.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error('Error removing book from list:', error);
    }
  };

  return (
    <Layout className={`my-book-list-page ${theme}`}>
      <NavBar />
      <Content
        style={{
          padding: '0 48px',
        }}
      >
        <Layout
          style={{
            padding: '24px 0',
            background: 'var(--background-color)', // Replace with the correct variable if needed
          }}
        >
          <Content
            style={{
              padding: '0 24px',
              minHeight: 280,
            }}
          >
            <div className="main-content">
              <h2>My Book List</h2>
              {loading ? (
                <Spin size="large" />
              ) : bookList.length === 0 ? (
                <div className="empty-list-message">
                  <p>Your book list is currently empty. To add some books, go to <Link to="/books">Library</Link>.</p>
                </div>
              ) : (
                <div className="books-container">
                  {bookList.map((book) => (
                    <Card
                      key={book.id}
                      hoverable
                      cover={<img alt={book.title} src={book.image_url} className="book-image" />}
                      className={`book-card ${theme}`} // Add theme class
                      actions={[
                        <Button type="primary" onClick={() => handleRemoveBook(book.id)}>Remove from List</Button>,
                      ]}
                    >
                      <Card.Meta title={book.title} description={`Author: ${book.author}`} />
                      <div className="rating">
                        <h4>Rating:</h4>
                        <Rate
                          value={book.rating || 0}
                          onChange={(nextValue) => handleStarClick(nextValue, book.id)}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              {error && <p className="error-message">{error}</p>}
            </div>
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
}

export default MyBookList;

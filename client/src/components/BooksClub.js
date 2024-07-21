import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BookClubsContext } from './context/BookClubsContext';
import { ThemeContext } from './context/ThemeContext';
import NavBar from './NavBar';
import { Card, Button } from 'antd';
import './css/BookClubs.css';

const BooksClub = () => {
  const { bookClubs } = useContext(BookClubsContext);
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`book-clubs-page ${theme}`}>
      <NavBar />
      <div className="content">
        <div className="book-clubs-container">
          {bookClubs.map((club) => (
            <Card
              key={club.id}
              className={`book-club-card ${theme}`}
              title={club.name}
              bordered={false}
            >
              <div className="book-club-info">
                <p>{club.description}</p>
                <p><strong>Members: </strong> {club.member_count}</p>
                <strong>Current Book: </strong><p>{club.current_book ? club.current_book.title : 'None'}</p>
                <div className="genres">
                  <strong>Genres:</strong> {club.genres.map((genre) => genre.name).join(', ')}
                </div>
                <Link to={`/book-clubs/${club.id}`}>
                  <Button type="primary" className="view-details-button">
                    View Details
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BooksClub;

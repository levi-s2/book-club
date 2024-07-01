import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BookClubsContext } from './context/BookClubsContext';
import NavBar from './NavBar';
import './css/BookClubs.css';

const BooksClub = () => {
  const { bookClubs } = useContext(BookClubsContext);

  return (
    <div>
      <NavBar />
      <div className="book-clubs-container">
        {bookClubs.map((club) => (
          <div key={club.id} className="book-club-card">
            <div className="book-club-info">
              <h3>{club.name}</h3>
              <p>{club.description}</p>
              <p>Current Book: {club.current_book ? club.current_book.title : 'None'}</p>
              <div className="genres">
                <strong>Genres:</strong> {club.genres.map((genre) => genre.name).join(', ')}
              </div>
              <Link to={`/book-clubs/${club.id}`} className="view-details-button">View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BooksClub;

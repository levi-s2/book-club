import React from 'react';
import './css/BookCard.css';

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <img src={book.image_url} alt={book.title} className="book-image" />
      <div className="book-info">
        <h3>{book.title}</h3>
        <p>Author: {book.author}</p>
        <p>Genre: {book.genre ? book.genre.name : 'Unknown'}</p>
      </div>
    </div>
  );
};

export default BookCard;

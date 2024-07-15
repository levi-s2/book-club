import React from 'react';
import { Button } from 'antd';
import './css/BookCard.css';

const BookCard = ({ book, theme, handleAddToList, isInList }) => {
  return (
    <div className={`book-card ${theme}`}>
      <img src={book.image_url} alt={book.title} className="book-image" />
      <div className="book-info">
        <h3>{book.title}</h3>
        <p>Author: {book.author}</p>
        <p>Genre: {book.genre ? book.genre.name : 'Unknown'}</p>
        <Button
          type="primary"
          onClick={() => handleAddToList(book.id)}
          disabled={isInList}
        >
          {isInList ? 'Added to List' : 'Add to List'}
        </Button>
      </div>
    </div>
  );
};

export default BookCard;

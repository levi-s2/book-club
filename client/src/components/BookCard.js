import React from 'react';
import { Card, Button } from 'antd';
import './css/BookCard.css';

const { Meta } = Card;

const BookCard = ({ book, theme, handleAddToList, isInList }) => {
  return (
    <Card
      className={`book-card ${theme}`}
      cover={<img src={book.image_url} alt={book.title} className="book-image" />}
    >
      <Meta
        title={book.title}
        description={
          <>
            <p>Author: {book.author}</p>
            <p>Genre: {book.genre ? book.genre.name : 'Unknown'}</p>
            <Button
              type="primary"
              onClick={() => handleAddToList(book.id)}
              disabled={isInList}
              className="view-details-button"
            >
              {isInList ? 'Added to List' : 'Add to List'}
            </Button>
          </>
        }
      />
    </Card>
  );
};

export default BookCard;

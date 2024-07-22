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
            <div className="book-info">
              <p><strong>Author: </strong>{book.author}</p>
              <p><strong>Genre: </strong>{book.genre ? book.genre.name : 'Unknown'}</p>
              <Button
                type="primary"
                onClick={() => handleAddToList(book.id)}
                disabled={isInList}
                className="view-details-button"
              >
                {isInList ? 'Added to List' : 'Add to List'}
              </Button>
            </div>
          </>
        }
      />
    </Card>
  );
};

export default BookCard;

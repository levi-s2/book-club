import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get('/books')
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the books!', error);
      });
  }, []);

  return (
    <div>
      <h1>Books</h1>
      <ul>
        {books.map(book => (
          <li key={book.id}>{book.title} by {book.author}</li>
        ))}
      </ul>
    </div>
  );
}

export default Books;

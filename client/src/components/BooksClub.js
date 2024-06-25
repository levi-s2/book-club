import React, { useContext } from 'react';
import { BookClubsContext } from './BookClubsContext';
import NavBar from './NavBar'

const BooksClub = () => {
  const { bookClubs } = useContext(BookClubsContext);

  console.log('Rendering book clubs:', bookClubs);

  return (
    <div>
      <NavBar />
      <h1>Book Clubs</h1>
      <ul>
        {bookClubs.map((club) => (
          <li key={club.id}>
            <h2>{club.name}</h2>
            <p>{club.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BooksClub;

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './context/AuthContext';
import { BookClubsContext } from './context/BookClubsContext';
import { BooksContext } from './context/BooksContext';
import { GenresContext } from './context/GenresContext';
import { ThemeContext } from './context/ThemeContext';
import { useHistory } from 'react-router-dom';
import { Form as AntForm, Checkbox, Button } from 'antd';
import NavBar from './NavBar';
import './css/ManageClub.css';

const ManageClub = () => {
  const { user, updateUserCreatedClubs } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const { fetchManageClubDetails, updateBookClub, updateCurrentReading, removeMember, updateGenres, deleteClub } = useContext(BookClubsContext);
  const { books } = useContext(BooksContext);
  const { genres } = useContext(GenresContext);
  const [clubDetails, setClubDetails] = useState(null);
  const [members, setMembers] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const fetchClubDetails = useCallback(async () => {
    try {
      if (user && user.created_clubs && user.created_clubs.length > 0) {
        const clubId = user.created_clubs[0].id || user.created_clubs[0];
        console.log('Fetching details for club ID:', clubId);
        const details = await fetchManageClubDetails(clubId);
        if (details) {
          setClubDetails(details);
          setMembers(details.members);
          setSelectedGenres(details.genres.map((genre) => genre.id));
        } else {
          setError('Error fetching club details.');
        }
      }
    } catch (error) {
      console.error('Error fetching club details:', error);
      setError('Error fetching club details.');
    }
  }, [user, fetchManageClubDetails]);

  useEffect(() => {
    fetchClubDetails();
  }, [fetchClubDetails]);

  const filterBooksByGenres = useCallback(() => {
    if (selectedGenres.length > 0) {
      const filtered = books.filter((book) =>
        selectedGenres.includes(book.genre.id)
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
    }
  }, [selectedGenres, books]);

  useEffect(() => {
    filterBooksByGenres();
  }, [selectedGenres, books, filterBooksByGenres]);

  const handleUpdateCurrentReading = async () => {
    if (!selectedBookId) {
      setError('You must select a book.');
      return;
    }

    const selectedBook = books.find((book) => book.id === selectedBookId);

    if (!selectedGenres.includes(selectedBook.genre.id)) {
      setError('The selected book does not match the club genres.');
      return;
    }

    try {
      const clubId = user.created_clubs[0].id || user.created_clubs[0];
      const response = await updateCurrentReading(clubId, selectedBookId);
      setMessage(response.message);
      const updatedClub = { ...clubDetails, current_book: selectedBook };
      setClubDetails(updatedClub);
      updateBookClub(updatedClub);
    } catch (error) {
      setError('Error updating current reading.');
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      const clubId = user.created_clubs[0].id || user.created_clubs[0];
      const response = await removeMember(clubId, memberId);
      setMessage(response.message);
      const updatedMembers = members.filter((member) => member.id !== memberId);
      setMembers(updatedMembers);
      const updatedClub = { ...clubDetails, members: updatedMembers };
      setClubDetails(updatedClub);
      updateBookClub(updatedClub);
    } catch (error) {
      setError('Error removing member.');
    }
  };

  const handleUpdateGenres = async () => {
    if (selectedGenres.length === 0) {
      setError('You must select at least one genre.');
      return;
    }
    try {
      const clubId = user.created_clubs[0].id || user.created_clubs[0];
      const response = await updateGenres(clubId, selectedGenres);
      setMessage(response.message);
      const updatedGenres = genres.filter((genre) => selectedGenres.includes(genre.id));
      const updatedClub = { ...clubDetails, genres: updatedGenres };
      setClubDetails(updatedClub);
      updateBookClub(updatedClub);
      filterBooksByGenres();
    } catch (error) {
      setError('Error updating genres.');
    }
  };

  const handleGenreChange = (genreId) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter(id => id !== genreId));
    } else if (selectedGenres.length < 3) {
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  const handleDeleteClub = async () => {
    try {
      const clubId = user.created_clubs[0].id || user.created_clubs[0];
      const response = await deleteClub(clubId);
      setMessage(response.message);

      const updatedClubs = user.created_clubs.filter((club) => club.id !== clubId);
      updateUserCreatedClubs(updatedClubs);

      updateBookClub({ ...clubDetails, deleted: true });

      history.push('/book-clubs');
    } catch (error) {
      setError('Error deleting book club.');
    }
  };

  if (!clubDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className={`manage-club-page ${theme}`}>
        <div className="left-column">
          <div className="manage-club-container">
            <h2>Manage My Club: {clubDetails ? clubDetails.name : 'Loading...'}</h2>
          </div>
          <AntForm.Item label="Update Genres (select up to 3)">
            <div className="genre-list">
              {genres.map((genre) => (
                <div key={genre.id} className="genre-item">
                  <Checkbox
                    id={`genre-${genre.id}`}
                    checked={selectedGenres.includes(genre.id)}
                    onChange={() => handleGenreChange(genre.id)}
                  >
                    {genre.name}
                  </Checkbox>
                </div>
              ))}
            </div>
            <Button type="primary" onClick={handleUpdateGenres} className="update-button">
              Update Genres
            </Button>
            <div>
            <Button type="danger" onClick={handleDeleteClub} className="delete-button">
              Delete Club
            </Button>
            </div>
          </AntForm.Item>
        </div>
        <div className="center-column">
          <div className="manage-section">
            <h3>Update Current Reading</h3>
            <div className="book-selection">
              {filteredBooks.map((book) => (
                <div key={book.id} className="book-item">
                  <Checkbox
                    type="radio"
                    id={`book-${book.id}`}
                    name="selectedBook"
                    value={book.id}
                    checked={selectedBookId === book.id}
                    onChange={() => setSelectedBookId(book.id)}
                  >
                    {book.title}
                  </Checkbox>
                </div>
              ))}
            </div>
            <Button type="primary" onClick={handleUpdateCurrentReading} className="update-button">
              Update Current Reading
            </Button>
          </div>
        </div>
        <div className="right-column">
          <div className="manage-section">
            <h3>Remove Members</h3>
            <ul>
              {members.map((member) => (
                <li key={member.id}>
                  {member.username}
                  <Button type="danger" onClick={() => handleRemoveMember(member.id)} className="remove-button">
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );  
};

export default ManageClub;

import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from './axiosConfig';
import { AuthContext } from './context/AuthContext';
import { BookClubsContext } from './context/BookClubsContext';
import { BooksContext } from './context/BooksContext';
import { GenresContext } from './context/GenresContext';
import { ThemeContext } from './context/ThemeContext';
import { useHistory } from 'react-router-dom';
import NavBar from './NavBar';
import './css/ManageClub.css';

const ManageClub = () => {
  const { user, updateUserCreatedClubs } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const { updateBookClub } = useContext(BookClubsContext);
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
        const response = await axios.get(`/manage-club/${clubId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setClubDetails(response.data);
        setMembers(response.data.members);
        setSelectedGenres(response.data.genres.map((genre) => genre.id));
      }
    } catch (error) {
      console.error('Error fetching club details:', error);
      setError('Error fetching club details.');
    }
  }, [user]);

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
      setFilteredBooks(books); // Show all books if no genre is selected
    }
  }, [selectedGenres, books]);

  useEffect(() => {
    filterBooksByGenres();
  }, [selectedGenres, books, filterBooksByGenres]);

  const handleUpdateCurrentReading = async () => {
    try {
      const clubId = user.created_clubs[0].id || user.created_clubs[0]; // Ensure correct ID format
      const response = await axios.patch(`/manage-club/${clubId}`, {
        action: 'update_current_reading',
        book_id: selectedBookId,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(response.data.message);
      const updatedClub = { ...clubDetails, current_book: books.find((book) => book.id === selectedBookId) };
      setClubDetails(updatedClub);
      updateBookClub(updatedClub);
    } catch (error) {
      setError('Error updating current reading.');
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      const clubId = user.created_clubs[0].id || user.created_clubs[0]; // Ensure correct ID format
      const response = await axios.patch(`/manage-club/${clubId}`, {
        action: 'remove_member',
        member_id: memberId,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(response.data.message);
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
      const clubId = user.created_clubs[0].id || user.created_clubs[0]; // Ensure correct ID format
      const response = await axios.patch(`/manage-club/${clubId}`, {
        action: 'update_genres',
        genre_ids: selectedGenres,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(response.data.message);
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
      const clubId = user.created_clubs[0].id || user.created_clubs[0]; // Ensure correct ID format
      const response = await axios.delete(`/manage-club/${clubId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(response.data.message);
      updateUserCreatedClubs(user.created_clubs.filter((clubId) => clubId !== clubDetails.id));
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
          <div className="genre-list">
            <h3>Update Genres (select up to 3)</h3>
            {genres.map((genre) => (
              <div key={genre.id} className="genre-item">
                <input
                  type="checkbox"
                  id={`genre-${genre.id}`}
                  value={genre.id}
                  checked={selectedGenres.includes(genre.id)}
                  onChange={() => handleGenreChange(genre.id)}
                />
                <label htmlFor={`genre-${genre.id}`}>{genre.name}</label>
              </div>
            ))}
            <button onClick={handleUpdateGenres}>Update Genres</button>
          </div>
        </div>
        <div className="center-column">
          <div className="manage-section">
            <h3>Update Current Reading</h3>
            <div className="book-selection">
              {filteredBooks.map((book) => (
                <div key={book.id} className="book-item">
                  <input
                    type="radio"
                    id={`book-${book.id}`}
                    name="selectedBook"
                    value={book.id}
                    checked={selectedBookId === book.id}
                    onChange={() => setSelectedBookId(book.id)}
                  />
                  <label htmlFor={`book-${book.id}`}>{book.title}</label>
                </div>
              ))}
            </div>
            <button onClick={handleUpdateCurrentReading}>Update Current Reading</button>
          </div>
        </div>
        <div className="right-column">
          <div className="manage-section">
            <h3>Remove Members</h3>
            <ul>
              {members.map((member) => (
                <li key={member.id}>
                  {member.username}
                  <button onClick={() => handleRemoveMember(member.id)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <button onClick={handleDeleteClub} className="delete-button">Delete Club</button>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ManageClub;
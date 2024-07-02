import React, { useState, useEffect, useContext } from 'react';
import axios from './axiosConfig';
import { AuthContext } from './context/AuthContext';
import NavBar from './NavBar';
import { useHistory } from 'react-router-dom';
import './css/ManageClub.css';

const ManageClub = () => {
  const { user, refreshUserData } = useContext(AuthContext);
  const [clubDetails, setClubDetails] = useState(null);
  const [genres, setGenres] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        const response = await axios.get(`/manage-club/${user.created_clubs[0]}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setClubDetails(response.data);
        setMembers(response.data.members);
        setSelectedGenres(response.data.genres.map((genre) => genre.id));
      } catch (error) {
        setError('Error fetching club details.');
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await axios.get('/genres', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setGenres(response.data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    if (user && user.created_clubs && user.created_clubs.length > 0) {
      fetchClubDetails();
      fetchGenres();
    }
  }, [user]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/books', {
          params: {
            genre_ids: selectedGenres,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    if (selectedGenres.length > 0) {
      fetchBooks();
    }
  }, [selectedGenres]);

  const handleUpdateCurrentReading = async () => {
    try {
      const response = await axios.patch(`/manage-club/${user.created_clubs[0]}`, {
        action: 'update_current_reading',
        book_id: selectedBookId,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      setError('Error updating current reading.');
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      const response = await axios.patch(`/manage-club/${user.created_clubs[0]}`, {
        action: 'remove_member',
        member_id: memberId,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(response.data.message);
      setMembers(members.filter((member) => member.id !== memberId));
    } catch (error) {
      setError('Error removing member.');
    }
  };

  const handleUpdateGenres = async () => {
    try {
      const response = await axios.patch(`/manage-club/${user.created_clubs[0]}`, {
        action: 'update_genres',
        genre_ids: selectedGenres,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(response.data.message);
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
      const response = await axios.delete(`/manage-club/${user.created_clubs[0]}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(response.data.message);
      refreshUserData();
      history.push('/book-clubs');
    } catch (error) {
      setError('Error deleting club.');
    }
  };

  if (!clubDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="manage-club-container">
        <h2>Manage My Club: {clubDetails.name}</h2>
        <div className="manage-section">
          <h3>Update Current Reading</h3>
          <div className="book-selection">
            {books.map((book) => (
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
        <div className="manage-section">
          <h3>Update Genres (select up to 3)</h3>
          <div className="genre-list">
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
          </div>
          <button onClick={handleUpdateGenres}>Update Genres</button>
        </div>
        <div className="manage-section">
          <h3>Delete Club</h3>
          <button onClick={handleDeleteClub} className="delete-club-button">Delete Club</button>
        </div>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ManageClub;

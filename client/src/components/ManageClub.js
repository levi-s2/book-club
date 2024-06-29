import React, { useState, useEffect, useContext } from 'react';
import axios from './axiosConfig';
import './css/ManageClub.css';
import { AuthContext } from './context/AuthContext';

const ManageClub = () => {
  const { user } = useContext(AuthContext);
  const [clubDetails, setClubDetails] = useState(null);
  const [genres, setGenres] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        console.log('Fetching club details...');
        const response = await axios.get(`/manage-club/${user.created_clubs[0]}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('Club details fetched:', response.data);
        setClubDetails(response.data);
        setMembers(response.data.members);
        setSelectedGenres(response.data.genres.map((genre) => genre.id));
      } catch (error) {
        console.error('Error fetching club details:', error);
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

  if (!clubDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="manage-club-container">
      <h2>Manage My Club: {clubDetails.name}</h2>
      <div className="manage-section">
        <h3>Update Current Reading</h3>
        <input
          type="text"
          placeholder="Enter Book ID"
          value={selectedBookId}
          onChange={(e) => setSelectedBookId(e.target.value)}
        />
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
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ManageClub;

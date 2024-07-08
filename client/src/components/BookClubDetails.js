import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from './axiosConfig';
import { AuthContext } from './context/AuthContext';
import './css/BookClubDetails.css';

const BookClubDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [clubDetails, setClubDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        const response = await axios.get(`/book-clubs/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setClubDetails(response.data);
      } catch (error) {
        setError('Error fetching club details.');
      }
    };

    fetchClubDetails();
  }, [id]);

  const handleJoinClub = async () => {
    try {
      const response = await axios.post(`/book-clubs/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setClubDetails(response.data); 
    } catch (error) {
      setError('Error joining club.');
    }
  };

  const handleLeaveClub = async () => {
    try {
      const response = await axios.delete(`/book-clubs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setClubDetails(response.data); 
    } catch (error) {
      setError('Error leaving club.');
    }
  };

  if (!clubDetails) {
    return <div>Loading...</div>;
  }

  const isCreator = user && clubDetails.creator && user.id === clubDetails.creator.id;

  return (
    <div className="book-club-details">
      <div className="club-header">
        <h2>{clubDetails.name}</h2>
        <p>{clubDetails.description}</p>
      </div>
      <div className="club-creator">
        <h3>Creator</h3>
        {clubDetails.creator ? (
          <p>{clubDetails.creator.username}</p>
        ) : (
          <p>Creator not available.</p>
        )}
      </div>
      <div className="club-members">
        <h3>Members</h3>
        {clubDetails.members && clubDetails.members.length > 0 ? (
          <ul>
            {clubDetails.members.map((member) => (
              <li key={member.id}>{member.username}</li>
            ))}
          </ul>
        ) : (
          <p>No members yet.</p>
        )}
      </div>
      <div className="club-current-reading">
        <h3>Current Reading</h3>
        {clubDetails.current_book ? (
          <div>
            <p>{clubDetails.current_book.title}</p>
            <img src={clubDetails.current_book.image_url} alt={clubDetails.current_book.title} />
          </div>
        ) : (
          <p>No current book.</p>
        )}
      </div>
      <div className="club-genres">
        <h3>Genres</h3>
        {clubDetails.genres && clubDetails.genres.length > 0 ? (
          <ul>
            {clubDetails.genres.map((genre) => (
              <li key={genre.id}>{genre.name}</li>
            ))}
          </ul>
        ) : (
          <p>No genres selected.</p>
        )}
      </div>
      {!clubDetails.is_member && !isCreator ? (
        <button onClick={handleJoinClub} className="join-club-button">Join Club</button>
      ) : (
        !isCreator && <button onClick={handleLeaveClub} className="leave-club-button">Leave Club</button>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default BookClubDetails;

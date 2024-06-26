import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from './axiosConfig';
import './css/BookClubDetails.css';

const BookClubDetails = () => {
  const { id } = useParams();
  const [clubDetails, setClubDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        const response = await axios.get(`/book-clubs/${id}`);
        setClubDetails(response.data);
      } catch (error) {
        setError('Error fetching club details.');
      }
    };

    fetchClubDetails();
  }, [id]);

  const handleJoinClub = async () => {
    try {
      await axios.post(`/book-clubs/${id}/join`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setClubDetails({ ...clubDetails, is_member: true });
    } catch (error) {
      setError('Error joining club.');
    }
  };

  if (!clubDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="book-club-details">
      <div className="club-header">
        <h2>{clubDetails.name}</h2>
        <p>{clubDetails.description}</p>
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
      {!clubDetails.is_member && (
        <button onClick={handleJoinClub} className="join-club-button">Join Club</button>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default BookClubDetails;

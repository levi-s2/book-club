import React, { useEffect, useState, useContext } from 'react';
import axios from './axiosConfig';
import { Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import NavBar from './NavBar';
import './css/MyClubs.css';

const MyClubs = () => {
  const { user } = useContext(AuthContext);
  const [myClubs, setMyClubs] = useState([]);
  

  useEffect(() => {
    const fetchMyClubs = async () => {
      if (user) {
        try {
          const response = await axios.get('/my-clubs', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setMyClubs(response.data);
        } catch (error) {
        }
      }
    };

    fetchMyClubs();
  }, [user]);

  if (!user) {
    return <div>Please log in to view your clubs.</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="my-clubs">
      <h2>My Book Clubs</h2>
      <div className="club-list">
        {myClubs.length > 0 ? (
          myClubs.map((club) => (
            <div key={club.id} className="club-card">
              <h3>{club.name}</h3>
              <p>{club.description}</p>
              <p>Current Book: {club.current_book ? club.current_book.title : 'None'}</p>
              <Link to={`/book-clubs/${club.id}`} className="view-details-button">View Details</Link>
            </div>
          ))
        ) : (
          <p>You are not part of any clubs yet.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default MyClubs;

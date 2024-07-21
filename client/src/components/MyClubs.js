import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';
import { BookClubsContext } from './context/BookClubsContext'; 
import NavBar from './NavBar';
import { Card, Button } from 'antd';
import './css/MyClubs.css';

const MyClubs = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const { fetchUserClubs } = useContext(BookClubsContext); 
  const [myClubs, setMyClubs] = useState([]);

  useEffect(() => {
    const fetchClubs = async () => {
      if (user) {
        try {
          const clubs = await fetchUserClubs();
          setMyClubs(clubs);
        } catch (error) {
          console.error('Error fetching my clubs:', error);
        }
      }
    };

    fetchClubs();
  }, [user, fetchUserClubs]);

  if (!user) {
    return <div>Please log in to view your clubs.</div>;
  }

  return (
    <div className={`page-container ${theme}`}>
      <NavBar />
      <div className={`my-clubs ${theme}`}>
        <h2>My Book Clubs</h2>
        <div className="club-list">
          {myClubs.length > 0 ? (
            myClubs.map((club) => (
              <Card
                key={club.id}
                className={`club-card ${theme}`}
                title={club.name}
                bordered={false}
              >
                <div className="club-info">
                  <p>{club.description}</p>
                  <p><strong>Members: </strong> {club.member_count}</p>
                  <strong>Current Book: </strong><p>{club.current_book ? club.current_book.title : 'None'}</p>
                  <Link to={`/book-clubs/${club.id}`}>
                    <Button type="primary" className="view-details-button">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
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

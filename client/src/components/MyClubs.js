import React, { useContext, useEffect, useState } from 'react';
import axios from './axiosConfig';
import { AuthContext } from './context/AuthContext';
import NavBar from './NavBar'

const MyClubs = () => {
  const { user } = useContext(AuthContext);
  const [myClubs, setMyClubs] = useState([]);

  useEffect(() => {
    const fetchMyClubs = async () => {
      try {
        const response = await axios.get('/my-clubs', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMyClubs(response.data);
      } catch (error) {
        console.error('Error fetching my clubs:', error);
      }
    };

    if (user) {
      fetchMyClubs();
    }
  }, [user]);

  return (
    <div className="my-clubs">
      <NavBar />
      <h1>My Clubs</h1>
      <ul>
        {myClubs.map((club) => (
          <li key={club.id}>
            <h2>{club.name}</h2>
            <p>{club.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyClubs;

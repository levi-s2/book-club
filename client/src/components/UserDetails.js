// UserDetails.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from './axiosConfig';
import NavBar from './NavBar';
import { ThemeContext } from './context/ThemeContext';
import { AuthContext } from './context/AuthContext';
import { Card, Spin, List, Button } from 'antd';
import './css/UserProfile.css';

const UserDetails = () => {
  const { userId } = useParams();
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUserDetails(response.data);
        setLoading(false);
        setIsFriend(user.friends.some((friend) => friend.id === parseInt(userId)));
      } catch (error) {
        setError('Error fetching user details.');
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, user.friends]);

  const handleAddFriend = async () => {
    try {
      await axios.post(`/users/${userId}/add-friend`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setIsFriend(true);
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        friends: [...prevDetails.friends, { id: user.id, username: user.username }],
      }));
    } catch (error) {
      setError('Error adding friend.');
    }
  };

  const handleRemoveFriend = async () => {
    try {
      await axios.delete(`/users/${userId}/remove-friend`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setIsFriend(false);
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        friends: prevDetails.friends.filter((friend) => friend.id !== user.id),
      }));
    } catch (error) {
      setError('Error removing friend.');
    }
  };

  return (
    <div className={`user-profile-page ${theme}`}>
      <NavBar />
      <div className="content">
        {loading ? (
          <Spin size="large" />
        ) : error ? (
          <p>{error}</p>
        ) : userDetails ? (
          <div className="profile-container">
            <Card className="profile-card">
              <img src={userDetails.profile_image_url} alt={userDetails.username} className="profile-image" />
              <h2>{userDetails.username}</h2>
              {isFriend ? (
                <Button onClick={handleRemoveFriend}>Remove Friend</Button>
              ) : (
                <Button onClick={handleAddFriend}>Add Friend</Button>
              )}
            </Card>
            <div className="friends-list">
              <h3>Friends</h3>
              <List
                itemLayout="horizontal"
                dataSource={userDetails.friends}
                renderItem={(friend) => (
                  <List.Item>
                    <List.Item.Meta
                      title={friend.username}
                    />
                  </List.Item>
                )}
              />
            </div>
            <div className="clubs-list">
              <h3>Clubs</h3>
              <List
                itemLayout="horizontal"
                dataSource={userDetails.created_clubs}
                renderItem={(club) => (
                  <List.Item>
                    <List.Item.Meta title={club.name} />
                  </List.Item>
                )}
              />
            </div>
            <div className="books-list">
              <h3>Books</h3>
              <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={userDetails.books}
                renderItem={(book) => (
                  <List.Item>
                    <Card
                      hoverable
                      cover={<img alt={book.title} src={book.image_url} />}
                    >
                      <Card.Meta title={book.title} description={`Author: ${book.author}`} />
                    </Card>
                  </List.Item>
                )}
              />
            </div>
          </div>
        ) : (
          <p>User not found</p>
        )}
      </div>
    </div>
  );
};

export default UserDetails;

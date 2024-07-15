import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from './axiosConfig';
import NavBar from './NavBar';
import { ThemeContext } from './context/ThemeContext';
import { Card, Spin, Rate, Button, List } from 'antd';
import './css/UserProfile.css';

const UserProfile = () => {
  const { userId } = useParams();
  const { theme } = useContext(ThemeContext);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      } catch (error) {
        setError('Error fetching user details.');
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleAddFriend = async (friendId) => {
    try {
      await axios.post('/friends', { friend_id: friendId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        friends: [...prevDetails.friends, { id: friendId, username: 'FriendUsername' }],
      }));
    } catch (error) {
      setError('Error adding friend.');
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
                      description={<Button onClick={() => handleAddFriend(friend.id)}>Add Friend</Button>}
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
                    <List.Item.Meta title={club.name} /> {/* Display club name */}
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
                      <Rate value={book.rating || 0} />
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

export default UserProfile;

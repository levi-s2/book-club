import React, { useEffect, useState, useContext } from 'react';
import axios from './axiosConfig';
import NavBar from './NavBar';
import { AuthContext } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';
import { Card, Spin, Rate, Button, List } from 'antd';
import { Link } from 'react-router-dom';
import './css/UserProfile.css';

const UserProfile = () => {
  const { user } = useContext(AuthContext); 
  const { theme } = useContext(ThemeContext);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user && user.id) {
        try {
          const response = await axios.get(`/users/${user.id}`, {
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
      } else {
        setError('User not found.');
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user]);


  const handleRemoveFriend = async (friendId) => {
    try {
      await axios.delete(`/users/${friendId}/remove-friend`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        friends: prevDetails.friends.filter((friend) => friend.id !== friendId),
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
            </Card>
            <div className="friends-list">
              <h3>Friends</h3>
              <List
                itemLayout="horizontal"
                dataSource={userDetails.friends}
                renderItem={(friend) => (
                  <List.Item
                    actions={[
                      <Button onClick={() => handleRemoveFriend(friend.id)}>Remove Friend</Button>,
                      <Link to={`/users/${friend.id}`}>View Profile</Link>
                    ]}
                  >
                    <List.Item.Meta
                      title={friend.username}
                    />
                  </List.Item>
                )}
              />
            </div>
            {userDetails.created_clubs.length > 0 && (
              <div className="created-clubs">
                <h3>Created Club</h3>
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
            )}
            <div className="clubs-list">
              <h3>Clubs</h3>
              <List
                itemLayout="horizontal"
                dataSource={userDetails.joined_clubs}
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

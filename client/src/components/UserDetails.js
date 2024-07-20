import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from './axiosConfig';
import NavBar from './NavBar';
import { ThemeContext } from './context/ThemeContext';
import { AuthContext } from './context/AuthContext';
import { Card, Spin, List, Rate } from 'antd';
import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import './css/UserDetails.css';
import defaultAvatar from './css/avatar-15.png';

const UserDetails = () => {
  const { userId } = useParams();
  const { theme } = useContext(ThemeContext);
  const { user, loading: userLoading } = useContext(AuthContext);
  const history = useHistory();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user && user.id === parseInt(userId)) {
        history.push('/my-profile');
      } else {
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
      }
    };

    if (!userLoading) {
      fetchUserDetails();
    }
  }, [userId, user, userLoading, history]);

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
        {loading || userLoading ? (
          <Spin size="large" />
        ) : error ? (
          <p>{error}</p>
        ) : userDetails ? (
          <div className="profile-container">
            <div className="left-column">
              <Card className="profile-card">
                <img src={userDetails.profile_image_url || defaultAvatar} alt={userDetails.username} className="profile-image" />
                <div className="profile-info">
                  <h2>{userDetails.username}</h2>
                  <div className="friend-action">
                    {isFriend ? (
                      <>
                        <UserDeleteOutlined onClick={handleRemoveFriend} style={{ fontSize: '20px', cursor: 'pointer', color: '#007bff' }} />
                        <span onClick={handleRemoveFriend} style={{ cursor: 'pointer', color: '#007bff' }}>Remove Friend</span>
                      </>
                    ) : (
                      <>
                        <UserAddOutlined onClick={handleAddFriend} style={{ fontSize: '20px', cursor: 'pointer', color: '#007bff' }} />
                        <span onClick={handleAddFriend} style={{ cursor: 'pointer', color: '#007bff' }}>Add Friend</span>
                      </>
                    )}
                  </div>
                </div>
              </Card>
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
                <h3>Joined Clubs</h3>
                {userDetails.joined_clubs.length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={userDetails.joined_clubs}
                    renderItem={(club) => (
                      <List.Item>
                        <List.Item.Meta title={club.name} /> 
                      </List.Item>
                    )}
                  />
                ) : (
                  <p>No clubs joined yet.</p>
                )}
              </div>
            </div>
            <div className="center-column">
              <h3>Books</h3>
              {userDetails.books.length > 0 ? (
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
              ) : (
                <p>No books yet.</p>
              )}
            </div>
            <div className="right-column">
              <h3>Friends</h3>
              {userDetails.friends.length > 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={userDetails.friends}
                  renderItem={(friend) => (
                    <List.Item>
                      <List.Item.Meta title={friend.username} />
                    </List.Item>
                  )}
                />
              ) : (
                <p>No friends yet.</p>
              )}
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

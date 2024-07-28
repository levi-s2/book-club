import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
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
  const { user, loading: userLoading, fetchUserDetailsById, addFriend, removeFriend, setUser } = useContext(AuthContext);
  const history = useHistory();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [friendsList, setFriendsList] = useState([]);
  const [isFriend, setIsFriend] = useState(false);

  const fetchUserDetails = useCallback(async () => {
    if (user && user.id === parseInt(userId)) {
      history.push('/my-profile');
    } else {
      try {
        const data = await fetchUserDetailsById(userId);
        setUserDetails(data);
        setFriendsList(data.friends);
        setIsFriend(user.friends.some((friend) => friend.id === parseInt(userId)));
        setLoading(false);
      } catch (error) {
        setError('Error fetching user details.');
        setLoading(false);
      }
    }
  }, [userId, user, history, fetchUserDetailsById]);

  useEffect(() => {
    if (!userLoading) {
      fetchUserDetails();
    }
  }, [fetchUserDetails, userLoading]);

  const handleAddFriend = async () => {
    try {
      const response = await addFriend(userId);
      setIsFriend(true);
      setFriendsList(response.friends);
      // Update user context
      setUser((prevUser) => ({
        ...prevUser,
        friends: response.friends,
      }));
    } catch (error) {
      setError('Error adding friend.');
    }
  };

  const handleRemoveFriend = async () => {
    try {
      const response = await removeFriend(userId);
      setIsFriend(false);
      setFriendsList(response.friends);
      // Update user context
      setUser((prevUser) => ({
        ...prevUser,
        friends: response.friends,
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
              {friendsList.length > 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={friendsList}
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

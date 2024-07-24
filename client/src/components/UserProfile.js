import React, { useEffect, useState, useContext } from 'react';
import NavBar from './NavBar';
import { AuthContext } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';
import { Card, Spin, List, Rate, Button } from 'antd';
import { Link } from 'react-router-dom';
import { UserDeleteOutlined, EyeOutlined } from '@ant-design/icons';
import './css/UserProfile.css';
import defaultAvatar from './css/avatar-15.png'; 
import UserUpdate from './UserUpdate'; 

const UserProfile = () => {
  const { user, fetchUserDetailsById, removeFriend } = useContext(AuthContext); 
  const { theme } = useContext(ThemeContext);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false); // State to control visibility of UserUpdate component

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user && user.id) {
        try {
          const data = await fetchUserDetailsById(user.id);
          setUserDetails(data);
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
  }, [user, fetchUserDetailsById]);

  const handleRemoveFriend = async (friendId) => {
    try {
      await removeFriend(friendId);
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        friends: prevDetails.friends.filter((friend) => friend.id !== friendId),
      }));
    } catch (error) {
      setError('Error removing friend.');
    }
  };

  const toggleUpdateForm = () => {
    setShowUpdateForm(!showUpdateForm); // Toggle visibility of UserUpdate component
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
            <div className="left-column">
              <Card className={`profile-card ${theme}`}>
                <img src={defaultAvatar} alt="User Avatar" className="profile-image" />
                <div className="profile-info">
                  <h2>{userDetails.username}</h2>
                </div>
              </Card>
              <Button onClick={toggleUpdateForm} className="update-info-button">Update Info</Button>
              {showUpdateForm && <UserUpdate user={userDetails} />} {/* Conditionally render UserUpdate component */}
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
                        className={`book-card ${theme}`} 
                        cover={<img alt={book.title} src={book.image_url} />}
                      >
                        <Card.Meta title={book.title} description={`Author: ${book.author}`} />
                        <Rate value={book.rating || 0} />
                      </Card>
                    </List.Item>
                  )}
                />
              ) : (
                <p>No books added yet.</p>
              )}
            </div>
            <div className="right-column">
              <h3>Friends</h3>
              {userDetails.friends.length > 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={userDetails.friends}
                  renderItem={(friend) => (
                    <List.Item
                      actions={[
                        <UserDeleteOutlined onClick={() => handleRemoveFriend(friend.id)} style={{ fontSize: '20px', cursor: 'pointer', color: '#007bff' }} />,
                        <Link to={`/users/${friend.id}`}><EyeOutlined style={{ fontSize: '20px', cursor: 'pointer', color: '#007bff' }} /></Link>
                      ]}
                    >
                      <List.Item.Meta
                        title={friend.username}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <p>No friends added yet.</p>
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

export default UserProfile;

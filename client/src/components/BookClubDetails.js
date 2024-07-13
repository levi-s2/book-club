import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from './axiosConfig';
import { AuthContext } from './context/AuthContext';
import NavBar from './NavBar';
import { Card, Form, Input, Button, List, Typography, Space } from 'antd';
import { LikeTwoTone, DislikeTwoTone } from '@ant-design/icons';
import './css/BookClubDetails.css';

const { TextArea } = Input;

const BookClubDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [clubDetails, setClubDetails] = useState(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [error, setError] = useState('');
  const [likedPosts, setLikedPosts] = useState({});
  const [dislikedPosts, setDislikedPosts] = useState({});

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        const response = await axios.get(`/book-clubs/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setClubDetails(response.data);
      } catch (error) {
        setError('Error fetching club details.');
      }
    };

    fetchClubDetails();
  }, [id]);

  const handleJoinClub = async () => {
    try {
      const response = await axios.post(`/book-clubs/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setClubDetails(response.data); 
    } catch (error) {
      setError('Error joining club.');
    }
  };

  const handleLeaveClub = async () => {
    try {
      const response = await axios.delete(`/book-clubs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setClubDetails(response.data); 
    } catch (error) {
      setError('Error leaving club.');
    }
  };

  const handleAddPost = async () => {
    if (!newPostContent) {
      setError('Post content cannot be empty.');
      return;
    }

    try {
      const response = await axios.post(`/book-clubs/${id}/posts`, { content: newPostContent }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setClubDetails(prevState => ({
        ...prevState,
        posts: [...prevState.posts, response.data]
      }));
      setNewPostContent('');
    } catch (error) {
      setError('Error adding post.');
    }
  };

  const handleEditPost = async (postId) => {
    if (!editedContent) {
      setError('Edited content cannot be empty.');
      return;
    }

    try {
      const response = await axios.patch(`/posts/${postId}`, { content: editedContent }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setClubDetails(prevState => ({
        ...prevState,
        posts: prevState.posts.map(post => post.id === postId ? response.data : post)
      }));
      setEditingPost(null);
      setEditedContent('');
    } catch (error) {
      setError('Error editing post.');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setClubDetails(prevState => ({
        ...prevState,
        posts: prevState.posts.filter(post => post.id !== postId)
      }));
    } catch (error) {
      setError('Error deleting post.');
    }
  };

  const handleVotePost = async (postId, vote) => {
    try {
      const response = await axios.post(`/posts/${postId}/vote`, { vote }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setClubDetails(prevState => ({
        ...prevState,
        posts: prevState.posts.map(post => post.id === postId ? response.data : post)
      }));
      if (vote === 1) {
        setLikedPosts(prev => ({ ...prev, [postId]: true }));
        setDislikedPosts(prev => ({ ...prev, [postId]: false }));
      } else {
        setLikedPosts(prev => ({ ...prev, [postId]: false }));
        setDislikedPosts(prev => ({ ...prev, [postId]: true }));
      }
    } catch (error) {
      setError('Error voting on post.');
    }
  };

  if (!clubDetails) {
    return <div>Loading...</div>;
  }

  const isCreator = user && clubDetails.creator && user.id === clubDetails.creator.id;
  const isMember = user && clubDetails.members.some(member => member.id === user.id);

  return (
    <div>
      <NavBar />
      <div className="book-club-details">
        <div className="left-column">
          <div className="club-header">
            <h2>{clubDetails.name}</h2>
            <p>{clubDetails.description}</p>
          </div>
          <div className="club-genres">
            <h3>Genres</h3>
            {clubDetails.genres && clubDetails.genres.length > 0 ? (
              <ul>
                {clubDetails.genres.map((genre) => (
                  <li key={genre.id}>{genre.name}</li>
                ))}
              </ul>
            ) : (
              <p>No genres selected.</p>
            )}
          </div>
          {!isMember && !isCreator ? (
            <Button type="primary" onClick={handleJoinClub} className="join-club-button">Join Club</Button>
          ) : (
            !isCreator && <Button type="danger" onClick={handleLeaveClub} className="leave-club-button">Leave Club</Button>
          )}
          {error && <Typography.Text type="danger" className="error-message">{error}</Typography.Text>}
          <div className="club-current-reading">
            <h3>Current Reading</h3>
            {clubDetails.current_book ? (
              <Card
                hoverable
                cover={<img alt={clubDetails.current_book.title} src={clubDetails.current_book.image_url} />}
              >
                <Card.Meta title={clubDetails.current_book.title} description={`Started at: ${new Date(clubDetails.current_book.started_at).toLocaleDateString()}`} />
              </Card>
            ) : (
              <p>No current book.</p>
            )}
          </div>
        </div>
        <div className="center-column">
          {isMember || isCreator ? (
            <div>
              <div className="new-post">
                <h4>Add a Post</h4>
                <Form onFinish={handleAddPost}>
                  <Form.Item name="postContent">
                    <TextArea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Write your post here..."
                      rows={4}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Post
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              <div className="club-posts">
                <h3>Posts</h3>
                {clubDetails.posts && clubDetails.posts.length > 0 ? (
                  <List
                    itemLayout="vertical"
                    size="large"
                    dataSource={clubDetails.posts}
                    renderItem={(post) => (
                      <List.Item
                        key={post.id}
                        actions={[
                          <Space>
                            <LikeTwoTone
                              onClick={() => handleVotePost(post.id, 1)}
                              twoToneColor={likedPosts[post.id] ? "#52c41a" : undefined}
                            />
                            <DislikeTwoTone
                              onClick={() => handleVotePost(post.id, -1)}
                              twoToneColor={dislikedPosts[post.id] ? "#eb2f96" : undefined}
                            />
                            {user && user.id === post.user_id && (
                              <>
                                <Button type="link" onClick={() => setEditingPost(post.id)}>Edit</Button>
                                <Button type="link" onClick={() => handleDeletePost(post.id)}>Delete</Button>
                              </>
                            )}
                          </Space>,
                        ]}
                      >
                        <List.Item.Meta
                          title={`By: ${post.username}`}
                          description={`Votes: ${post.votes}`}
                        />
                        {editingPost === post.id ? (
                          <div>
                            <TextArea
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                              rows={4}
                            />
                            <Button onClick={() => handleEditPost(post.id)}>Save</Button>
                          </div>
                        ) : (
                          <Typography.Paragraph>{post.content}</Typography.Paragraph>
                        )}
                      </List.Item>
                    )}
                  />
                ) : (
                  <p>No posts yet.</p>
                )}
              </div>
            </div>
          ) : (
            <p>You must be a member to view and post comments.</p>
          )}
        </div>
        <div className="right-column">
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
        </div>
      </div>
    </div>
  );
};

export default BookClubDetails;

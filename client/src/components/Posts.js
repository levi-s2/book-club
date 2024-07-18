import React, { useState, useContext, useEffect } from 'react';
import axios from './axiosConfig';
import { AuthContext } from './context/AuthContext';
import { List, Form, Input, Button, Typography, Space } from 'antd';
import { LikeTwoTone, DislikeTwoTone } from '@ant-design/icons';

const { TextArea } = Input;

const Posts = ({ clubId, posts, setPosts }) => {
  const { user } = useContext(AuthContext);
  const [newPostContent, setNewPostContent] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [error, setError] = useState('');
  const [userVotes, setUserVotes] = useState({});

  useEffect(() => {
    const fetchPostsAndVotes = async () => {
      try {
        const response = await axios.get(`/book-clubs/${clubId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPosts(response.data.posts || []);
        
        const votes = response.data.posts.reduce((acc, post) => {
          acc[post.id] = post.user_voted;
          return acc;
        }, {});

        setUserVotes(votes);
      } catch (error) {
        console.error('Error fetching posts and votes:', error);
      }
    };

    if (user) {
      fetchPostsAndVotes();
    }
  }, [user, clubId, setPosts]);

  const handleAddPost = async () => {
    if (!newPostContent) {
      setError('Post content cannot be empty.');
      return;
    }

    try {
      const response = await axios.post(`/book-clubs/${clubId}/posts`, { content: newPostContent }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPosts((prevState) => [...(prevState || []), response.data]);
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
      setPosts((prevState) =>
        (prevState || []).map((post) => (post.id === postId ? response.data : post))
      );
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
      setPosts((prevState) => (prevState || []).filter((post) => post.id !== postId));
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
      setPosts((prevState) =>
        (prevState || []).map((post) => (post.id === postId ? response.data : post))
      );
      setUserVotes((prev) => ({ ...prev, [postId]: prev[postId] === vote ? null : vote }));
    } catch (error) {
      setError('Error voting on post.');
    }
  };

  return (
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
          {error && <Typography.Text type="danger" className="error-message">{error}</Typography.Text>}
        </Form>
      </div>
      <div className="club-posts">
        <h3>Posts</h3>
        {posts && posts.length > 0 ? (
          <List
            itemLayout="vertical"
            size="large"
            dataSource={posts}
            renderItem={(post) => (
              <List.Item
                key={post.id}
                actions={[
                  <Space>
                    <LikeTwoTone
                      onClick={() => handleVotePost(post.id, 1)}
                      twoToneColor={userVotes[post.id] === 1 ? "#52c41a" : undefined}
                    />
                    <DislikeTwoTone
                      onClick={() => handleVotePost(post.id, -1)}
                      twoToneColor={userVotes[post.id] === -1 ? "#eb2f96" : undefined}
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
  );
};

export default Posts;

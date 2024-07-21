import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import { PostsContext } from './context/PostsContext';
import { List, Form, Input, Button, Typography, Space, message } from 'antd';
import { LikeTwoTone, DislikeTwoTone } from '@ant-design/icons';

const { TextArea } = Input;

const Posts = ({ clubId }) => {
  const { user } = useContext(AuthContext);
  const { posts, userVotes, fetchPostsAndVotes, addPost, editPost, deletePost, votePost } = useContext(PostsContext);
  const [form] = Form.useForm();
  const [newPostContent, setNewPostContent] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchPostsAndVotes(clubId);
    }
  }, [user, clubId, fetchPostsAndVotes]);

  const handleAddPost = async (values) => {
    if (!values.content) {
      setError('Post content cannot be empty.');
      return;
    }

    try {
      await addPost(clubId, values.content);
      form.resetFields(); // Clear the input field
      message.success('Post added successfully');
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
      await editPost(postId, editedContent);
      setEditingPost(null);
      setEditedContent('');
      message.success('Post edited successfully');
    } catch (error) {
      setError('Error editing post.');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      message.success('Post deleted successfully');
    } catch (error) {
      setError('Error deleting post.');
    }
  };

  const handleVotePost = async (postId, vote) => {
    try {
      await votePost(postId, vote);
    } catch (error) {
      setError('Error voting on post.');
    }
  };

  return (
    <div>
      <div className="new-post">
        <h4>Add a Post</h4>
        <Form form={form} onFinish={handleAddPost}>
          <Form.Item name="content">
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
                        <Button
                          type="link"
                          style={{ padding: '0' }}
                          onClick={() => {
                            setEditingPost(post.id);
                            setEditedContent(post.content);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          type="link"
                          style={{ padding: '0' }}
                          onClick={() => handleDeletePost(post.id)}
                        >
                          Delete
                        </Button>
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

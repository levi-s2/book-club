import React, { createContext, useState, useCallback } from 'react';
import axios from '../axiosConfig';


const PostsContext = createContext();

const PostsProvider = ({ children }) => {

  const [posts, setPosts] = useState([]);
  const [userVotes, setUserVotes] = useState({});

  const fetchPostsAndVotes = useCallback(async (clubId) => {
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
  }, []);

  const addPost = useCallback(async (clubId, content) => {
    try {
      const response = await axios.post(`/book-clubs/${clubId}/posts`, { content }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPosts((prevState) => [...(prevState || []), response.data]);
    } catch (error) {
      console.error('Error adding post:', error);
      throw error;
    }
  }, []);

  const editPost = useCallback(async (postId, content) => {
    try {
      const response = await axios.patch(`/posts/${postId}`, { content }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPosts((prevState) =>
        (prevState || []).map((post) => (post.id === postId ? response.data : post))
      );
    } catch (error) {
      console.error('Error editing post:', error);
      throw error;
    }
  }, []);

  const deletePost = useCallback(async (postId) => {
    try {
      await axios.delete(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPosts((prevState) => (prevState || []).filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }, []);

  const votePost = useCallback(async (postId, vote) => {
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
      console.error('Error voting on post:', error);
      throw error;
    }
  }, []);

  return (
    <PostsContext.Provider value={{ posts, userVotes, fetchPostsAndVotes, addPost, editPost, deletePost, votePost }}>
      {children}
    </PostsContext.Provider>
  );
};

export { PostsProvider, PostsContext };

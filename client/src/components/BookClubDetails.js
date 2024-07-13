import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from './axiosConfig';
import { AuthContext } from './context/AuthContext';
import NavBar from './NavBar';
import './css/BookClubDetails.css';
import { LikeTwoTone, DislikeTwoTone } from '@ant-design/icons';
const BookClubDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [clubDetails, setClubDetails] = useState(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [error, setError] = useState('');

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
          <div className="club-current-reading">
            <h3>Current Reading</h3>
            {clubDetails.current_book ? (
              <div>
                <p>{clubDetails.current_book.title}</p>
                <img src={clubDetails.current_book.image_url} alt={clubDetails.current_book.title} />
                <p>Started at: {new Date(clubDetails.current_book.started_at).toLocaleDateString()}</p>
              </div>
            ) : (
              <p>No current book.</p>
            )}
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
        </div>
        <div className="center-column">
          {isMember || isCreator ? (
            <div>
              <div className="new-post">
                <h4>Add a Post</h4>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Write your post here..."
                />
                <button onClick={handleAddPost}>Post</button>
              </div>
              <div className="club-posts">
                <h3>Posts</h3>
                {clubDetails.posts && clubDetails.posts.length > 0 ? (
                  <ul>
                    {clubDetails.posts.map((post) => (
                      <li key={post.id}>
                        <p>{post.content}</p>
                        <p>By: {post.username}</p>
                        <p>Votes: {post.votes}</p>
                        <LikeTwoTone onClick={() => handleVotePost(post.id, 1)}/>
                        <DislikeTwoTone onClick={() => handleVotePost(post.id, -1)}/>
                        {user && user.id === post.user_id && (
                          <>
                            <button onClick={() => setEditingPost(post.id)}>Edit</button>
                            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                          </>
                        )}
                        {editingPost === post.id && (
                          <div>
                            <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
                            <button onClick={() => handleEditPost(post.id)}>Save</button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
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
      {!isMember && !isCreator ? (
        <button onClick={handleJoinClub} className="join-club-button">Join Club</button>
      ) : (
        !isCreator && <button onClick={handleLeaveClub} className="leave-club-button">Leave Club</button>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default BookClubDetails;

import React, { useState } from 'react';
import axios from './axiosConfig';
import './css/CreateClub.css';

const CreateClub = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('/create-club', { name, description }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(response.data.message);
      setName('');
      setDescription('');
    } catch (error) {
      setError('Error creating book club.');
    }
  };

  return (
    <div className="create-club-container">
      <h2>Create a New Book Club</h2>
      <form onSubmit={handleSubmit} className="create-club-form">
        <div className="form-group">
          <label htmlFor="name">Club Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="create-club-button">Create Club</button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default CreateClub;

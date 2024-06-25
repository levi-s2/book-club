import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from './axiosConfig';
import { AuthContext } from './context/AuthContext';
import NavBar from './NavBar'

const CreateClub = () => {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/book-clubs', {
        name,
        description,
        created_by: user.id,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      history.push('/book-clubs');
    } catch (error) {
      setError('Error creating club. Please try again.');
      console.error('Error creating club:', error);
    }
  };

  return (
    <div className="create-club">
      <NavBar />
      <h1>Create a New Club</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        </div>
        <button type="submit">Create Club</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default CreateClub;

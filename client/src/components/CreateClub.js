import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import './css/CreateClub.css';

const CreateClub = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('/genres', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setGenres(response.data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreChange = (genreId) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter(id => id !== genreId));
    } else if (selectedGenres.length < 3) {
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('/create-club', { name, description, genre_ids: selectedGenres }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(response.data.message);
      setName('');
      setDescription('');
      setSelectedGenres([]);
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
        <div className="form-group">
          <label>Genres (select up to 3):</label>
          <div className="genre-list">
            {genres.map((genre) => (
              <div key={genre.id} className="genre-item">
                <input
                  type="checkbox"
                  id={`genre-${genre.id}`}
                  value={genre.id}
                  checked={selectedGenres.includes(genre.id)}
                  onChange={() => handleGenreChange(genre.id)}
                />
                <label htmlFor={`genre-${genre.id}`}>{genre.name}</label>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="create-club-button">Create Club</button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default CreateClub;
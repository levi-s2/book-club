import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import NavBar from './NavBar';
import './css/CreateClub.css';

const CreateClub = () => {
  const [genres, setGenres] = useState([]);
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

  const handleSubmit = async (values, { setSubmitting }) => {
    setMessage('');
    setError('');

    try {
      const response = await axios.post('/create-club', values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(response.data.message);
      setSubmitting(false);
      window.location.href = '/book-clubs'; // Redirect after successful creation
    } catch (error) {
      setError('Error creating book club.');
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Club name is required'),
    description: Yup.string(),
    genre_ids: Yup.array().of(Yup.number()).min(1, 'At least one genre must be selected').max(3, 'You can select up to 3 genres'),
  });

  return (
    <div>
      <NavBar />
      <div className="create-club-container">
      <h2>Create a New Book Club</h2>
      <Formik
        initialValues={{ name: '', description: '', genre_ids: [] }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="create-club-form">
            <div className="form-group">
              <label htmlFor="name">Club Name:</label>
              <Field type="text" id="name" name="name" required />
              <ErrorMessage name="name" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <Field as="textarea" id="description" name="description" />
            </div>
            <div className="form-group">
              <label>Genres (select up to 3):</label>
              <div className="genre-list">
                {genres.map((genre) => (
                  <div key={genre.id} className="genre-item">
                    <Field
                      type="checkbox"
                      id={`genre-${genre.id}`}
                      name="genre_ids"
                      value={genre.id}
                      checked={values.genre_ids.includes(genre.id)}
                      onChange={() => {
                        const newGenreIds = values.genre_ids.includes(genre.id)
                          ? values.genre_ids.filter((id) => id !== genre.id)
                          : [...values.genre_ids, genre.id].slice(0, 3);
                        setFieldValue('genre_ids', newGenreIds);
                      }}
                    />
                    <label htmlFor={`genre-${genre.id}`}>{genre.name}</label>
                  </div>
                ))}
              </div>
              <ErrorMessage name="genre_ids" component="div" className="error-message" />
            </div>
            <button type="submit" className="create-club-button" disabled={isSubmitting}>
              Create Club
            </button>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
          </Form>
        )}
      </Formik>
    </div>
    </div>
  );
};

export default CreateClub;

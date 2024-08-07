import React, { useState, useContext } from 'react';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import NavBar from './NavBar';
import { AuthContext } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';
import { GenresContext } from './context/GenresContext';
import { BookClubsContext } from './context/BookClubsContext';
import { Form as AntForm, Input, Checkbox, Button, Alert } from 'antd';
import './css/CreateClub.css';

const CreateClub = () => {
  const { user, updateUserCreatedClubs } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const { genres } = useContext(GenresContext);
  const { createClub } = useContext(BookClubsContext); 
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    setMessage('');
    setError('');

    try {
      const response = await createClub(values);
      setMessage(response.message);
      updateUserCreatedClubs([...user.created_clubs, response.club]);
      window.location.href = '/book-clubs';
    } catch (error) {
      setError('Error creating book club.');
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Club name is required'),
    description: Yup.string().required('Description is required'),
    genre_ids: Yup.array().of(Yup.number()).min(1, 'At least one genre must be selected').max(3, 'You can select up to 3 genres'),
  });

  if (user && user.created_clubs && user.created_clubs.length > 0) {
    return (
      <div>
        <NavBar />
        <div className={`create-club-container ${theme}`}>
          <h2>You have already created a book club</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className={`create-club-container ${theme}`}>
        <h2>Create a New Book Club</h2>
        <Formik
          initialValues={{ name: '', description: '', genre_ids: [] }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="create-club-form">
              <AntForm.Item label="Club Name" name="name">
                <Field as={Input} id="name" name="name" />
                <ErrorMessage name="name" component="div" className="error-message" />
              </AntForm.Item>
              <AntForm.Item label="Description" name="description">
                <Field as={Input.TextArea} id="description" name="description" />
                <ErrorMessage name="description" component="div" className="error-message" />
              </AntForm.Item>
              <AntForm.Item label="Genres (select up to 3)">
                <div className="genre-list">
                  {genres.map((genre) => (
                    <div key={genre.id} className="genre-item">
                      <Checkbox
                        id={`genre-${genre.id}`}
                        checked={values.genre_ids.includes(genre.id)}
                        onChange={() => {
                          const newGenreIds = values.genre_ids.includes(genre.id)
                            ? values.genre_ids.filter((id) => id !== genre.id)
                            : [...values.genre_ids, genre.id].slice(0, 3);
                          setFieldValue('genre_ids', newGenreIds);
                        }}
                      >
                        {genre.name}
                      </Checkbox>
                    </div>
                  ))}
                </div>
                <ErrorMessage name="genre_ids" component="div" className="error-message" />
              </AntForm.Item>
              <AntForm.Item>
                <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                  Create Club
                </Button>
              </AntForm.Item>
              {message && <Alert message={message} type="success" />}
              {error && <Alert message={error} type="error" />}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateClub;

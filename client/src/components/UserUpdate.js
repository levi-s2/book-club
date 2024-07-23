import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from './context/AuthContext';
import { Form as AntForm, Input, Button, message } from 'antd';
import './css/UserUpdate.css'; // Add appropriate styles

const UserUpdate = ({ user }) => {
  const { updateUsername, updateEmail, updatePassword } = useContext(AuthContext);

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters long')
      .max(30, 'Username cannot be longer than 30 characters')
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters long')
      .required('Password is required'),
  });

  const handleUpdate = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      if (values.username !== user.username) {
        await updateUsername(user.id, values.username);
      }
      if (values.email !== user.email) {
        await updateEmail(user.id, values.email);
      }
      if (values.password) {
        await updatePassword(user.id, values.password);
      }
      message.success('Profile updated successfully!');
      resetForm();
    } catch (error) {
      setErrors({ general: 'Update failed: ' + error.message });
      message.error('Update failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="user-update-container">
      <Formik
        initialValues={{
          username: user.username,
          email: user.email,
          password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleUpdate}
      >
        {({ isSubmitting, errors }) => (
          <Form className="user-update-form">
            <AntForm.Item label="Username" name="username">
              <Field as={Input} name="username" type="text" />
              <ErrorMessage name="username" component="div" className="error-message" />
            </AntForm.Item>
            <AntForm.Item label="Email" name="email">
              <Field as={Input} name="email" type="email" />
              <ErrorMessage name="email" component="div" className="error-message" />
            </AntForm.Item>
            <AntForm.Item label="Password" name="password">
              <Field as={Input.Password} name="password" />
              <ErrorMessage name="password" component="div" className="error-message" />
            </AntForm.Item>
            <Button type="primary" htmlType="submit" disabled={isSubmitting}>
              Update Profile
            </Button>
            {errors.general && <p className="error-message">{errors.general}</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserUpdate;

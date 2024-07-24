import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from './context/AuthContext';
import { Form as AntForm, Input, Button, message } from 'antd';
import './css/UserUpdate.css';

const UserUpdate = ({ user }) => {
  const { updateUsername, updateEmail, updatePassword, authenticateUser, setUser } = useContext(AuthContext);

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters long')
      .max(30, 'Username cannot be longer than 30 characters')
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    currentPassword: Yup.string()
      .required('Current password is required'),
    newPassword: Yup.string()
      .min(6, 'New password must be at least 6 characters long'),
  });

  const handleUpdate = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const isAuthenticated = await authenticateUser(user.email, values.currentPassword);
      if (!isAuthenticated) {
        setErrors({ currentPassword: 'Current password is incorrect' });
        setSubmitting(false);
        return;
      }

      const updatedUser = { ...user };
      if (values.username !== user.username) {
        await updateUsername(user.id, values.username);
        updatedUser.username = values.username;
      }
      if (values.email !== user.email) {
        await updateEmail(user.id, values.email);
        updatedUser.email = values.email;
      }
      if (values.newPassword) {
        await updatePassword(user.id, values.newPassword);
      }

      setUser(updatedUser); // Update the context state with the new user info
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
          currentPassword: '',
          newPassword: '',
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
            <AntForm.Item label="Current Password" name="currentPassword">
              <Field as={Input.Password} name="currentPassword" />
              <ErrorMessage name="currentPassword" component="div" className="error-message" />
            </AntForm.Item>
            <AntForm.Item label="New Password" name="newPassword">
              <Field as={Input.Password} name="newPassword" />
              <ErrorMessage name="newPassword" component="div" className="error-message" />
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

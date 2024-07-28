import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from './context/AuthContext';
import { Form as AntForm, Input, Button, message } from 'antd';
import './css/Register.css';

const Register = ({ theme }) => {
  const history = useHistory();
  const { register } = useContext(AuthContext);

  const initialValues = {
    username: '',
    email: '',
    password: '',
  };

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

  const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      await register(values.username, values.email, values.password);
      message.success('Registration successful!');
      resetForm();
      history.push('/');
    } catch (error) {
      message.error('Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`register-container ${theme}`}>
      <h2>Register</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="register-form">
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
              Register
            </Button>
            {errors.general && <p className="error-message">{errors.general}</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;

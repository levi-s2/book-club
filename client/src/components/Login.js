import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from './context/AuthContext';
import { Form as AntForm, Input, Button, message } from 'antd';
import './css/login.css';

const Login = ({ theme }) => {
  const history = useHistory();
  const { login } = useContext(AuthContext);

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters long')
      .required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await login(values.email, values.password);
      message.success('Login successful!');
      history.push('/book-clubs');
    } catch (error) {
      setErrors({ general: 'Login failed: ' + error.message });
      message.error('Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`login-container ${theme}`}>
      <h2>Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="login-form">
            <AntForm.Item label="Email" name="email">
              <Field as={Input} name="email" type="email" />
              <ErrorMessage name="email" component="div" className="error-message" />
            </AntForm.Item>
            <AntForm.Item label="Password" name="password">
              <Field as={Input.Password} name="password" />
              <ErrorMessage name="password" component="div" className="error-message" />
            </AntForm.Item>
            <Button type="primary" htmlType="submit" disabled={isSubmitting}>
              Login
            </Button>
            {errors.general && <p className="error-message">{errors.general}</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;

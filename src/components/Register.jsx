// src/components/Register.jsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Required'),
  });

  const onSubmit = (values, { setSubmitting, setStatus }) => {
    axios.post('http://localhost:3000/users', {
      name: values.name,
      email: values.email,
      password: values.password
    })
    .then(response => {
      localStorage.setItem('currentUser', JSON.stringify(response.data));
      setStatus({ success: true });
      navigate('/profile');
    })
    .catch(error => {
      setStatus({ success: false, message: error.message });
    })
    .finally(() => {
      setSubmitting(false);
    });
  };

  return (
    <div className="form-container">
      <div className="form-content">
        <h2>Register</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting, status }) => (
            <Form>
              <div>
                <label htmlFor="name">Name</label>
                <Field type="text" id="name" name="name" />
                <ErrorMessage name="name" component="div" className="error-message" />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <Field type="email" id="email" name="email" />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <Field type="password" id="password" name="password" />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>
              <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Field type="password" id="confirmPassword" name="confirmPassword" />
                <ErrorMessage name="confirmPassword" component="div" className="error-message" />
              </div>
              <button type="submit" disabled={isSubmitting}>Register</button>
              {status && status.success && <div>Registration successful!</div>}
              {status && !status.success && <div className="error-message">Error: {status.message}</div>}
            </Form>
          )}
        </Formik>
        <Link to="/" className="back-button">Back</Link>
      </div>
    </div>
  );
};

export default Register;

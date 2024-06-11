// src/components/Login.jsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().required('Required'),
  });

  const onSubmit = (values, { setSubmitting, setStatus }) => {
    axios.get(`http://localhost:3000/users?email=${values.email}&password=${values.password}`)
    .then(response => {
      if (response.data.length > 0) {
        localStorage.setItem('currentUser', JSON.stringify(response.data[0]));
        setStatus({ success: true });
        navigate('/profile');
      } else {
        setStatus({ success: false, message: 'Invalid credentials' });
      }
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
        <h2>Login</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting, status }) => (
            <Form>
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
              <button type="submit" disabled={isSubmitting}>Login</button>
              {status && status.success && <div>Login successful!</div>}
              {status && !status.success && <div className="error-message">Error: {status.message}</div>}
            </Form>
          )}
        </Formik>
        <Link to="/" className="back-button">Back</Link>
      </div>
    </div>
  );
};

export default Login;

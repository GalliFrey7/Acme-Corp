// src/components/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      setUser(currentUser);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (values, { setSubmitting, setStatus }) => {
    axios.put(`http://localhost:3000/users/${user.id}`, values)
      .then(response => {
        localStorage.setItem('currentUser', JSON.stringify(response.data));
        setUser(response.data);
        setIsEditing(false);
        setStatus({ success: true });
      })
      .catch(error => {
        setStatus({ success: false, message: error.message });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <header className="home-header">
        <h1>Acme Corp</h1>
        <nav>
          <ul>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
          </ul>
        </nav>
      </header>
      <div className="profile-content">
        <button className="close-button" onClick={() => navigate('/')}>×</button>
        {isEditing ? (
          <Formik
            initialValues={{ name: user.name, email: user.email }}
            validationSchema={Yup.object({
              name: Yup.string().required('Required'),
              email: Yup.string().email('Invalid email format').required('Required'),
            })}
            onSubmit={handleSave}
          >
            {({ isSubmitting, status }) => (
              <Form className="profile-form">
                <div className="profile-header">
                  <img src="https://via.placeholder.com/150" alt="Profile" className="profile-image" />
                  <div className="profile-info">
                  <h2>{user.name}</h2>
                  <p>{user.email}</p>
                  </div>
                </div>
                <div className="profile-field">
                  <label htmlFor="name">Name</label>
                  <Field type="text" id="name" name="name" />
                  <ErrorMessage name="name" component="div" className="error-message" />
                </div>
                <div className="profile-field">
                  <label htmlFor="email">Email account</label>
                  <Field type="email" id="email" name="email" />
                  <ErrorMessage name="email" component="div" className="error-message" />
                </div>
                <button type="submit" disabled={isSubmitting} className="save-button">Save Change</button>
                {status && status.success && <div>Profile updated successfully!</div>}
                {status && !status.success && <div className="error-message">Error: {status.message}</div>}
              </Form>
            )}
          </Formik>
        ) : (
          <div className="profile-view">
            <div className="profile-header">
              <img src="https://via.placeholder.com/150" alt="Profile" className="profile-image" />
              <div className="profile-info">
                <h2>{user.name}</h2>
                <p>{user.email}</p>
              </div>
            </div>
            <div className="profile-field">
              <label>Name</label>
              <p>{user.name}</p>
            </div>
            <div className="profile-field">
              <label>Email account</label>
              <p>{user.email}</p>
            </div>
            <button onClick={handleEdit} className="edit-button">Edit</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

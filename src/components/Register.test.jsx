// src/components/Register.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';
import axios from 'axios';

jest.mock('axios');

describe('Register Component', () => {
  test('renders the registration form', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('displays validation messages', async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.submit(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findAllByText(/required/i)).toHaveLength(4);
  });

  test('submits the form with valid data', async () => {
    axios.post.mockResolvedValue({ data: { id: 1, name: 'erkhan', email: 'erkhan@gmail.com' } });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.input(screen.getByLabelText(/name/i), {
      target: { value: 'erkhan' },
    });
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'erkhan@gmail.com' },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.input(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  test('handles server error', async () => {
    axios.post.mockRejectedValue(new Error('Request failed with status code 500'));

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.input(screen.getByLabelText(/name/i), {
      target: { value: 'erkhan' },
    });
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'erkhan@gmail.com' },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.input(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/error: request failed with status code 500/i)).toBeInTheDocument();
  });
});

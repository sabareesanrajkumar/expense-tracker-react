import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

function ForgotPassword({ onBack }) {
  const emailInputRef = useRef();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const enteredEmail = emailInputRef.current.value;

    if (!enteredEmail) {
      setMessage('Please enter your email.');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.REACT_APP_FIREBASE_WEB_API_KEY}`,
        {
          requestType: 'PASSWORD_RESET',
          email: enteredEmail,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage('A reset link has been sent to your email.');
    } catch (error) {
      setMessage(
        error.response?.data?.error?.message || 'Failed to send reset email'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="mb-4 text-center">Forgot Password</h2>
      {message && <Alert variant="info">{message}</Alert>}

      <Form onSubmit={handleForgotPassword}>
        <Form.Group className="mb-3" controlId="forgotEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your registered email"
            ref={emailInputRef}
            required
          />
        </Form.Group>

        <Button
          variant="warning"
          type="submit"
          className="w-100"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Sending Reset Link...
            </>
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </Form>

      <div className="text-center mt-3">
        <Button variant="link" onClick={onBack}>
          Back to Login
        </Button>
      </div>
    </>
  );
}

export default ForgotPassword;

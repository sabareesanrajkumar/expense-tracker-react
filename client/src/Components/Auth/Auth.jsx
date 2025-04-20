import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { AuthContext } from './AuthContext';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const [message, setMessage] = useState('');
  const authContext = useContext(AuthContext);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const submitHandler = async (e) => {
    e.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredConfirmPassword = confirmPasswordInputRef.current?.value;

    if (!isLogin && enteredPassword !== enteredConfirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    if (
      enteredEmail === '' ||
      enteredPassword === '' ||
      enteredConfirmPassword === ''
    ) {
      setMessage('Fill all fields');
      return;
    }

    const url = isLogin
      ? `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_WEB_API_KEY}`
      : `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_WEB_API_KEY}`;

    try {
      const response = await axios.post(
        url,
        {
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
      authContext.login(response.data.idToken);

      setMessage('Authentication successful!');
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
      const errorMsg =
        error.response?.data?.error?.message || 'Authentication failed';
      setMessage(errorMsg);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          {isAuthenticated ? (
            <h2 className="mb-4 text-center">Welcome to Expense Tracker</h2>
          ) : (
            <>
              {' '}
              <h2 className="mb-4 text-center">
                {isLogin ? 'Login' : 'Sign Up'}
              </h2>
              {message && <Alert variant="info">{message}</Alert>}
              <Form onSubmit={submitHandler}>
                <Form.Group
                  as={Row}
                  className="mb-3 align-items-center"
                  controlId="authEmail"
                >
                  <Form.Label column sm={4}>
                    Email address
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      required
                      ref={emailInputRef}
                    />
                  </Col>
                </Form.Group>

                <Form.Group
                  as={Row}
                  className="mb-3 align-items-center"
                  controlId="authPassword"
                >
                  <Form.Label column sm={4}>
                    Password
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      required
                      ref={passwordInputRef}
                    />
                  </Col>
                </Form.Group>
                {!isLogin && (
                  <Form.Group
                    as={Row}
                    className="mb-3 align-items-center"
                    controlId="authConfirmPassword"
                  >
                    <Form.Label column sm={4}>
                      Confirm Password
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="password"
                        placeholder="Confirm Password"
                        required
                        ref={confirmPasswordInputRef}
                      />
                    </Col>
                  </Form.Group>
                )}

                <Button
                  variant={isLogin ? 'success' : 'primary'}
                  type="submit"
                  className="w-100"
                >
                  {isLogin ? 'Login' : 'Sign Up'}
                </Button>
              </Form>
              <div className="text-center mt-3">
                <Button
                  variant="link"
                  onClick={() => setIsLogin((prev) => !prev)}
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Login'}
                </Button>
              </div>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Auth;

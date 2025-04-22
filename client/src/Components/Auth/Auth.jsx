import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
//import { AuthContext } from './AuthContext';
import Profile from '../Profile/Profile';
import ForgotPassword from './ForgotPassword';

//using reducers
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store/authSlice';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const [message, setMessage] = useState('');
  //const authContext = useContext(AuthContext);
  const [isUpdateProfile, setIsUpdateProfile] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  //submit Handler
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
      //authContext.login(response.data.idToken);
      dispatch(
        authActions.login({
          token: response.data.idToken,
          userId: response.data.localId,
        })
      );

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
          {isLoggedIn ? (
            <Profile
              setIsUpdateProfile={setIsUpdateProfile}
              isUpdateProfile={isUpdateProfile}
              setMessage={setMessage}
            />
          ) : showForgotPassword ? (
            <ForgotPassword onBack={() => setShowForgotPassword(false)} />
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
                {isLogin && (
                  <Button
                    variant="link"
                    className="text-center mt-2"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Password?
                  </Button>
                )}
              </Form>
              <div className="text-center mt-1">
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

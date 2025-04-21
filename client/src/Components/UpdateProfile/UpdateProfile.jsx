import React, { useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Auth/AuthContext';
import { Form, Button, Row, Col } from 'react-bootstrap';

const UpdateProfile = (props) => {
  const fullName = useRef();
  const photoUrl = useRef();

  const authCtx = useContext(AuthContext);

  const idToken = localStorage.getItem('token');
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.REACT_APP_FIREBASE_WEB_API_KEY}`,
          {
            idToken,
          }
        );
        const user = response.data.users[0];
        if (user.displayName) fullName.current.value = user.displayName;
        if (user.photoUrl) photoUrl.current.value = user.photoUrl;
      } catch (err) {
        console.error(err);
      }
    };
    if (authCtx.token) {
      fetchProfile();
    }
  }, [authCtx.token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_FIREBASE_WEB_API_KEY}`,
        {
          idToken,
          displayName: fullName.current.value,
          photoUrl: photoUrl.current.value,
          returnSecureToken: true,
        }
      );
      props.setIsUpdateProfile((prev) => !prev);
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data?.error);
    }
  };
  return (
    <>
      <Form onSubmit={submitHandler}>
        <Form.Group as={Row} className="mb-3 align-items-center">
          <Form.Label column sm={4}>
            Full Name
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="text"
              placeholder="Full Name"
              required
              ref={fullName}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3 align-items-center">
          <Form.Label column sm={4}>
            Photo URL
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="url"
              placeholder="Photo URL"
              required
              ref={photoUrl}
            />
          </Col>
        </Form.Group>

        <Button variant="success" type="submit" className="w-100">
          Update
        </Button>
      </Form>
    </>
  );
};

export default UpdateProfile;

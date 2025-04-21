import React, { useRef } from 'react';
import axios from 'axios';

import { Form, Button, Row, Col } from 'react-bootstrap';

const UpdateProfile = (props) => {
  const fullName = useRef();
  const photoUrl = useRef();

  const submitHandler = async (e) => {
    e.preventDefault();
    const idToken = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_FIREBASE_WEB_API_KEY}`,
        {
          idToken,
          fullName: fullName.current.value,
          photoUrl: photoUrl.current.value,
          returnSecureToken: true,
        }
      );

      const lookup = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.REACT_APP_FIREBASE_WEB_API_KEY}`,
        {
          idToken,
        }
      );
      console.log('lp>>>>>>>>>>>>>', lookup);
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

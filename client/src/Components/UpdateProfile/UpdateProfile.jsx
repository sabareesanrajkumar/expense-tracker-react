import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import { AuthContext } from '../Auth/AuthContext';
import { Form, Button, Row, Col } from 'react-bootstrap';

//using reducer
import { useSelector } from 'react-redux';

const UpdateProfile = (props) => {
  const [fullName, setFullName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  //const authCtx = useContext(AuthContext);
  const token = useSelector((state) => state.auth.token);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.REACT_APP_FIREBASE_WEB_API_KEY}`,
          {
            idToken: token,
          }
        );
        const user = response.data.users[0];
        if (user.displayName) setFullName(user.displayName);
        if (user.photoUrl) setPhotoUrl(user.photoUrl);
      } catch (err) {
        console.error(err);
      }
    };
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_FIREBASE_WEB_API_KEY}`,
        {
          idToken: token,
          displayName: fullName,
          photoUrl: photoUrl,
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
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
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

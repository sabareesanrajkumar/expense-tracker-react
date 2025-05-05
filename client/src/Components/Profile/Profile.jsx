import React, { useContext, useEffect } from 'react';
import UpdateProfile from '../UpdateProfile/UpdateProfile';
//import { AuthContext } from '../Auth/AuthContext';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './profile.css';
//reducer
import { useSelector, useDispatch } from 'react-redux';
import {
  authActions,
  checkEmailVerification,
  sendVerificationEmail,
} from '../store/authSlice';

const Profile = (props) => {
  const { setIsUpdateProfile, isUpdateProfile, setMessage } = props;
  //const authContext = useContext(AuthContext);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const emailVerified = useSelector((state) => state.auth.emailVerified);
  const token = useSelector((state) => state.auth.token);

  //checks email already verified or not
  useEffect(() => {
    if (token) {
      dispatch(checkEmailVerification(token));
    }
  }, [token, dispatch]);

  const handleLogout = () => {
    setMessage('Logged Out');
    dispatch(authActions.logout());
  };
  return (
    <>
      <div className="fixed-top-buttons">
        <Button
          className="btn-consistent"
          variant="primary"
          onClick={() => setIsUpdateProfile((prev) => !prev)}
        >
          {isUpdateProfile ? 'Back' : 'Update Profile'}
        </Button>

        {isLoggedIn && !emailVerified ? (
          <Button
            className="btn-consistent"
            variant="warning"
            onClick={() => dispatch(sendVerificationEmail(token))}
          >
            Verify Email ID
          </Button>
        ) : (
          isLoggedIn && (
            <Button
              className="btn-consistent"
              variant="outline-success"
              disabled
            >
              Email Verified
            </Button>
          )
        )}

        <Button
          className="btn-consistent"
          variant="danger"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>

      <h1 className="hero-heading">Welcome to Expense Tracker</h1>

      <div className="text-center mt-5">
        <Button
          style={{ marginBottom: '15px' }}
          onClick={() => navigate('/expenses')}
        >
          Go to Expenses
        </Button>
      </div>

      {isUpdateProfile && (
        <UpdateProfile setIsUpdateProfile={setIsUpdateProfile} />
      )}
    </>
  );
};

export default Profile;

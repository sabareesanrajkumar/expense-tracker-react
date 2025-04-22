import React, { useContext, useEffect } from 'react';
import UpdateProfile from '../UpdateProfile/UpdateProfile';
//import { AuthContext } from '../Auth/AuthContext';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-center flex-grow-1 mb-0">
          Welcome to Expense Tracker
        </h2>

        <Button
          className="ms-0"
          onClick={() => {
            setIsUpdateProfile((prev) => !prev);
          }}
        >
          {isUpdateProfile ? `Back` : `Update Profile`}
        </Button>
        {isLoggedIn && !emailVerified && (
          <Button
            className="ms-2"
            onClick={() => dispatch(sendVerificationEmail(token))}
          >
            Verify Email ID
          </Button>
        )}
        {isLoggedIn && emailVerified && <p>Email Verified</p>}
        <Button className="ms-2" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Button onClick={() => navigate('/expenses')}>Go to Expenses</Button>
      {isUpdateProfile && (
        <UpdateProfile setIsUpdateProfile={setIsUpdateProfile} />
      )}
    </>
  );
};

export default Profile;

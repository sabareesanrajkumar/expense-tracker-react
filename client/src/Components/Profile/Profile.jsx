import React, { useContext } from 'react';
import UpdateProfile from '../UpdateProfile/UpdateProfile';
import { AuthContext } from '../Auth/AuthContext';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Profile = (props) => {
  const { setIsUpdateProfile, isUpdateProfile, setMessage } = props;
  const authContext = useContext(AuthContext);

  const navigate = useNavigate();
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
        {authContext.isLoggedIn && !authContext.emailVerified && (
          <Button className="ms-2" onClick={authContext.sendVerificationEmail}>
            Verify Email ID
          </Button>
        )}
        {authContext.isLoggedIn && authContext.emailVerified && (
          <p>Email Verified</p>
        )}
        <Button
          className="ms-2"
          onClick={() => {
            setMessage('Logged Out');
            authContext.logout();
          }}
        >
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

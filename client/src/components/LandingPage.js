import React from 'react';
import Login from './Login';
import Register from './Register';
import './css/LandingPage.css';

const LandingPage = () => {

  return (
    <div className="landing-page">
      <div className="welcome-section">
        <h1>Welcome to the Book Club Platform</h1>
      </div>
      <div className="form-section">
        <div className="form-container">
          <Login />
          <Register />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

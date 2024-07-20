import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './css/LandingPage.css';

const LandingPage = () => {
  const [showRegister, setShowRegister] = useState(false);

  const toggleForm = () => {
    setShowRegister((prev) => !prev);
  };

  return (
    <div className="landing-page">
      <div className="left-section">
        <div className="welcome-section">
          <h1>Welcome to the Book Club Platform</h1>
          <p>
            Discover and join book clubs, share your thoughts on books, and connect
            with fellow book enthusiasts. Create your own book club, manage your reading
            list, and stay updated with the latest posts and reviews.
          </p>
        </div>
      </div>
      <div className="right-section">
        <div className="form-container">
          {showRegister ? <Register /> : <Login />}
          <button onClick={toggleForm} className="toggle-button">
            {showRegister ? 'Already registered? Log in' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

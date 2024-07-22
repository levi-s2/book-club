import React, { useState, useContext } from 'react';
import Login from './Login';
import Register from './Register';
import { ThemeContext } from './context/ThemeContext';
import './css/LandingPage.css';

const LandingPage = () => {
  const [showRegister, setShowRegister] = useState(false);
  const { theme } = useContext(ThemeContext);

  const toggleForm = () => {
    setShowRegister((prev) => !prev);
  };

  return (
    <div className={`landing-page ${theme}`}>
      <div className="left-section">
        <div className="welcome-section">
          <h1>Welcome to the Book Club Platform</h1>
          <p>
            Discover and join book clubs made by our community and connect
            with fellow book enthusiasts. Create your own club and manage your readings
            for your members. Want to show others the books you most appreciate? Explore
            our vast library and add any books to your own custom list and display your 
            ratings in your profile for friends to see!
          </p>
        </div>
      </div>
      <div className="right-section">
        <div className="form-container">
          {showRegister ? <Register theme={theme} /> : <Login theme={theme} />}
          <button onClick={toggleForm} className="toggle-button">
            {showRegister ? 'Already registered? Log in' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

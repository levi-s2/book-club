import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="landing-page">
      <h1>Welcome to the Book Club Platform</h1>
      {isLogin ? <Login /> : <Register />}
      <button onClick={toggleForm} className="toggle-button">
        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
    </div>
  );
};

export default LandingPage;

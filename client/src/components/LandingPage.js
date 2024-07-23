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
        <div className="hero-section">
          <h1>Welcome to the Book Club Platform</h1>
          <p>
            Discover and join book clubs made by our community and connect
            with fellow book enthusiasts. Create your own club and manage your readings
            for your members. Show others the books you appreciate the most. Explore
            our vast library, add books to your custom list, and display your ratings
            in your profile for friends to see!
          </p>
        </div>

        <div className="testimonials-section">
          <div className="testimonial">
            <p>"This platform has rekindled my love for reading!" - Jane Doe</p>
          </div>
          <div className="testimonial">
            <p>"A fantastic way to connect with other book lovers." - John Smith</p>
          </div>
          <div className="testimonial">
            <p>"An incredible resource for finding new books." - Sarah Lee</p>
          </div>
          <div className="testimonial">
            <p>"I love being able to join clubs and discuss my favorite books." - Mark Brown</p>
          </div>
        </div>
      </div>

      <div className="right-section">
        <div className="features-section">
          <div className="feature-card">
            <h3>Join Book Clubs</h3>
            <p>Connect with like-minded readers.</p>
          </div>
          <div className="feature-card">
            <h3>Create Your Own Club</h3>
            <p>Start and manage your own book club.</p>
          </div>
          <div className="feature-card">
            <h3>Manage Readings</h3>
            <p>Organize your reading lists.</p>
          </div>
          <div className="feature-card">
            <h3>Explore Library</h3>
            <p>Find and add new books.</p>
          </div>
          <div className="feature-card">
            <h3>Custom Book List</h3>
            <p>Personalize your book collection.</p>
          </div>
        </div>

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

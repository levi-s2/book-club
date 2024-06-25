import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import './css/NavBar.css';

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
        <Link to="/book-clubs">Book Clubs</Link>
        <Link to="/my-clubs">My Clubs</Link>
        <Link to="new-club">Create a Club</Link>
        <Link to="/books">Library</Link>
        {user ? (
          <>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
    </nav>
  );
}

export default Navbar;

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home';
import Books from './Books';
import BookClubs from './BooksClub';
import Navbar from './NavBar';
import Login from './Login';
import Register from './Register';

function App() {
  return (
    <div>
      <Navbar />
      <Router>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/book-clubs" element={<BookClubs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Router>
    </div>
  );
}

export default App;

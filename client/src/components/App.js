import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LandingPage from './LandingPage';
import Books from './Books';
import BooksClub from './BooksClub';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { BookClubsProvider, BookClubsContext } from './context/BookClubsContext'; // Correct import
import ProtectedRoute from './ProtectedRoute';
import axios from './axiosConfig';

const App = () => {
  return (
    <AuthProvider>
      <BookClubsProvider>
        <Router>
          <Main />
        </Router>
      </BookClubsProvider>
    </AuthProvider>
  );
};

const Main = () => {
  const { user, loading } = useContext(AuthContext);
  const { setBookClubs } = useContext(BookClubsContext); // Ensure BookClubsContext is imported

  useEffect(() => {
    const fetchBookClubs = async () => {
      if (user) {
        try {
          console.log('Fetching book clubs...');
          const response = await axios.get('/book-clubs', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          console.log('Book clubs fetched:', response.data);
          setBookClubs(response.data);
        } catch (error) {
          console.error('Error fetching book clubs:', error);
        }
      }
    };

    fetchBookClubs();
  }, [user, setBookClubs]);

  if (loading) {
    return <div>Loading...</div>; // Render a loading state while checking the token
  }

  return (
    <Switch>
      <Route path="/" exact component={LandingPage} />
      <ProtectedRoute path="/books" component={Books} />
      <ProtectedRoute path="/book-clubs" component={BooksClub} />
      <Redirect to="/" /> {/* Redirect any unknown routes to the landing page */}
    </Switch>
  );
};

export default App;

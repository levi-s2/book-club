import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LandingPage from './LandingPage';
import Books from './Books';
import BooksClub from './BooksClub';
import { AuthProvider, AuthContext } from './AuthContext';
import { BookClubsProvider, BookClubsContext } from './BookClubsContext';
import ProtectedRoute from './ProtectedRoute';
import axios from './axiosConfig';

const App = () => {
  const { user } = useContext(AuthContext);
  const { setBookClubs } = useContext(BookClubsContext);

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

  return (
    <AuthProvider>
      <BookClubsProvider>
        <Router>
          <Switch>
            <Route path="/" exact component={LandingPage} />
            <ProtectedRoute path="/books" component={Books} />
            <ProtectedRoute path="/book-clubs" component={BooksClub} />
          </Switch>
        </Router>
      </BookClubsProvider>
    </AuthProvider>
  );
}

export default App;

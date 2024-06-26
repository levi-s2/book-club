import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LandingPage from './LandingPage';
import Books from './Books';
import BooksClub from './BooksClub';
import MyClubs from './MyClubs';
import CreateClub from './CreateClub';
import BookClubDetails from './BookClubDetails';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { BookClubsProvider, BookClubsContext } from './context/BookClubsContext';
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

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <Switch>
      <Route path="/" exact component={LandingPage} />
      <ProtectedRoute path="/books" component={Books} />
      <ProtectedRoute path="/book-clubs" exact component={BooksClub} />
      <ProtectedRoute path="/book-clubs/:id" component={BookClubDetails} /> 
      <ProtectedRoute path="/my-clubs" component={MyClubs} />
      <ProtectedRoute path="/new-club" component={CreateClub} />
      <Redirect to="/" /> 
    </Switch>
  );
};

export default App;

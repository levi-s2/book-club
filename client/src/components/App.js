import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LandingPage from './LandingPage';
import Books from './Books';
import BooksClub from './BooksClub';
import MyClubs from './MyClubs';
import CreateClub from './CreateClub';
import ManageClub from './ManageClub';
import BookClubDetails from './BookClubDetails';
import MyBookList from './MyBookList';
import UserProfile from './UserProfile'; // Import UserProfile
import UserDetails from './UserDetails'; // Import UserDetails
import { AuthProvider, AuthContext } from './context/AuthContext';
import { BookClubsProvider, BookClubsContext } from './context/BookClubsContext';
import { BooksProvider } from './context/BooksContext';
import { GenresProvider } from './context/GenresContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './ProtectedRoute';
import axios from './axiosConfig';

const App = () => {
  return (
    <AuthProvider>
      <BookClubsProvider>
        <ThemeProvider>
          <Router>
            <Main />
          </Router>
        </ThemeProvider>
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
          const response = await axios.get('/book-clubs', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
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
    <Router>
      <BooksProvider>
        <GenresProvider>
          <Switch>
            <Route path="/" exact component={LandingPage} />
            <ProtectedRoute path="/books" component={Books} />
            <ProtectedRoute path="/book-clubs" exact component={BooksClub} />
            <ProtectedRoute path="/book-clubs/:id" component={BookClubDetails} />
            <ProtectedRoute path="/my-clubs" component={MyClubs} />
            <ProtectedRoute path="/new-club" component={CreateClub} />
            <ProtectedRoute path="/manage-club" component={ManageClub} />
            <ProtectedRoute path="/my-book-list" component={MyBookList} />
            <ProtectedRoute path="/my-profile" component={UserProfile} />
            <ProtectedRoute path="/users/:userId" component={UserDetails} />
            <Redirect to="/" />
          </Switch>
        </GenresProvider>
      </BooksProvider>
    </Router>
  );
};

export default App;

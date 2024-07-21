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
import UserProfile from './UserProfile';
import UserDetails from './UserDetails';
import { AuthProvider } from './context/AuthContext';
import { BookClubsProvider } from './context/BookClubsContext';
import { BooksProvider } from './context/BooksContext';
import { GenresProvider } from './context/GenresContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import ProtectedRoute from './ProtectedRoute';


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
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-mode' : 'light-mode';
  }, [theme]);

  return (
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
  );
};

export default App;

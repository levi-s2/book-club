import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
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
import { PostsProvider } from './context/PostsContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  const { theme: appTheme } = useContext(ThemeContext);

  const themeSettings = appTheme === 'dark' ? {
    algorithm: theme.darkAlgorithm,
    token: {
      colorPrimary: '#2f54eb',
      colorInfo: '#2f54eb',
      colorBgContainer: '#1f1f1f',
    },
  } : {
    algorithm: theme.defaultAlgorithm,
    token: {
      colorPrimary: '#2f54eb',
      colorInfo: '#2f54eb',
      colorBgContainer: '#ffffff',
    },
  };

  useEffect(() => {
    document.body.className = appTheme === 'dark' ? 'dark-mode' : 'light-mode';
  }, [appTheme]);

  return (
    <ConfigProvider theme={themeSettings}>
      <Router>
        <Main />
      </Router>
    </ConfigProvider>
  );
};

const Main = () => {
  return (
    <AuthProvider>
      <BookClubsProvider>
        <PostsProvider>
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
        </PostsProvider>
      </BookClubsProvider>
    </AuthProvider>
  );
};

const Root = () => (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

export default Root;

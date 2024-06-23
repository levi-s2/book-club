import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LandingPage from './LandingPage';
import Books from './Books';
import BooksClub from './BooksClub';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/" exact component={LandingPage} />
          <ProtectedRoute path="/books" component={Books} />
          <ProtectedRoute path="/book-clubs" component={BooksClub} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;

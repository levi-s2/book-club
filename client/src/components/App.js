import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Books from './Books';
import BooksClub from './BooksClub';
import NavBar from './NavBar';
import Login from './Login';
import Register from './Register';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/books" component={Books} />
          <Route path="/book-clubs" component={BooksClub} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;

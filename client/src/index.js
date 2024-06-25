import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import { AuthProvider } from './components/AuthContext';
import { BookClubsProvider } from './components/BookClubsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <BookClubsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BookClubsProvider>
  </AuthProvider>
);

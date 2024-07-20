import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import { AuthProvider } from './components/context/AuthContext';
import { BookClubsProvider } from './components/context/BookClubsContext';
import './components/css/index.css'; 

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

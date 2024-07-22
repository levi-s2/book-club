import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Root from './components/App';
import { AuthProvider } from './components/context/AuthContext';
import { BookClubsProvider } from './components/context/BookClubsContext';
import { PostsProvider } from './components/context/PostsContext';
import './components/css/index.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <BookClubsProvider>
      <PostsProvider> 
        <BrowserRouter>
          <Root />
        </BrowserRouter>
      </PostsProvider>
    </BookClubsProvider>
  </AuthProvider>
);

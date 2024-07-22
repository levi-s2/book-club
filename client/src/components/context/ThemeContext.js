import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const { user, updateUserThemePreference } = useContext(AuthContext);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (user) {
      setTheme(user.dark_mode ? 'dark' : 'light');
    }
  }, [user]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (user) {
      updateUserThemePreference(newTheme === 'dark');
    }
  };

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-mode' : 'light-mode';
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };

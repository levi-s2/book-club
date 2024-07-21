import React, { useContext, useState, useEffect } from 'react';
import { AppstoreOutlined, SettingOutlined, BookOutlined, UserOutlined, LogoutOutlined, PlusOutlined, ReadOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';
import { SunOutlined, MoonOutlined } from '@ant-design/icons'; 
import './css/NavBar.css'; 

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const [current, setCurrent] = useState('');

  useEffect(() => {
    const path = location.pathname.split('/')[1];
    setCurrent(path || 'book-clubs');
  }, [location]);

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const items = [
    {
      label: <Link to="/book-clubs">Book Clubs</Link>,
      key: 'book-clubs',
      icon: <BookOutlined />,
    },
    {
      label: <Link to="/my-clubs">My Clubs</Link>,
      key: 'my-clubs',
      icon: <ReadOutlined />,
    },
    {
      label: <Link to="/new-club">Create a Club</Link>,
      key: 'new-club',
      icon: <PlusOutlined />,
    },
    {
      label: <Link to="/books">Library</Link>,
      key: '',
      icon: <AppstoreOutlined />,
    },
    {
      label: <Link to="/my-book-list">My Book List</Link>,
      key: 'my-book-list',
      icon: <AppstoreOutlined />,
    },
    user && user.created_clubs && user.created_clubs.length > 0 && {
      label: <Link to="/manage-club">Manage My Club</Link>,
      key: 'manage-club',
      icon: <SettingOutlined />,
    },
    user && {
      label: <Link to="/my-profile">My Profile</Link>,
      key: 'my-profile',
      icon: <UserOutlined />,
    },
    {
      label: (
        <span className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </span>
      ),
      key: 'theme',
    },
    user && {
      label: 'Logout',
      key: 'logout',
      icon: <LogoutOutlined />,
      onClick: logout,
      className: 'logout-button', 
    },
  ].filter(Boolean);

  return (
    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} className={`navbar ${theme}`} />
  );
};

export default NavBar;

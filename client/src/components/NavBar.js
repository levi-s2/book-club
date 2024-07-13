import React, { useContext, useState, useEffect } from 'react';
import { AppstoreOutlined, SettingOutlined, BookOutlined, UserOutlined, LogoutOutlined, PlusOutlined, ReadOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';


const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
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
      key: 'library',
      icon: <AppstoreOutlined />,
    },
    user && user.created_clubs && user.created_clubs.length > 0 && {
      label: <Link to="/manage-club">Manage My Club</Link>,
      key: 'manage-club',
      icon: <SettingOutlined />,
    },
    user
      ? {
          label: 'Logout',
          key: 'logout',
          icon: <LogoutOutlined />,
          onClick: logout,
        }
      : [
          {
            label: <Link to="/login">Login</Link>,
            key: 'login',
            icon: <UserOutlined />,
          },
          {
            label: <Link to="/register">Register</Link>,
            key: 'register',
            icon: <UserOutlined />,
          },
        ],
  ].filter(Boolean); // Filter out any falsey values

  return (
    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
  );
};

export default NavBar;
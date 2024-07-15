import React, { useContext, useState, useEffect } from 'react';
import { AppstoreOutlined, SettingOutlined, BookOutlined, UserOutlined, LogoutOutlined, PlusOutlined, ReadOutlined, BulbOutlined } from '@ant-design/icons';
import { Menu, Switch } from 'antd';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const history = useHistory();
  const [current, setCurrent] = useState('');

  useEffect(() => {
    const path = location.pathname.split('/')[1];
    setCurrent(path || 'book-clubs');
  }, [location]);

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const goToProfile = () => {
    if (user) {
      history.push(`/users/${user.id}`);
    }
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
      label: <span onClick={goToProfile}>My Profile</span>,
      key: 'my-profile',
      icon: <UserOutlined />,
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
    {
      label: (
        <Switch
          checked={theme === 'dark'}
          onChange={toggleTheme}
          checkedChildren={<BulbOutlined />}
          unCheckedChildren={<BulbOutlined />}
        />
      ),
      key: 'theme',
      icon: <BulbOutlined />,
    },
  ].filter(Boolean); // Filter out any falsey values

  return (
    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
  );
};

export default NavBar;

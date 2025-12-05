/**
 * Sidebar Component
 * 
 * Navigation sidebar with links to main sections.
 * Uses Ant Design components.
 */

import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Dropdown, Button, Switch, Divider } from 'antd';
import {
  HomeOutlined,
  HomeFilled,
  SearchOutlined,
  PlusSquareOutlined,
  HeartOutlined,
  HeartFilled,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  LoginOutlined,
  MenuOutlined,
  LikeOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const { Sider } = Layout;

// Strings Logo SVG
const StringsLogo = () => (
  <svg width="28" height="28" viewBox="0 0 100 100" fill="currentColor">
    <path d="M50 5C25.1 5 5 25.1 5 50s20.1 45 45 45 45-20.1 45-45S74.9 5 50 5zm0 80c-19.3 0-35-15.7-35-35s15.7-35 35-35 35 15.7 35 35-15.7 35-35 35z"/>
    <path d="M65 35c-2.8 0-5 2.2-5 5v20c0 2.8 2.2 5 5 5s5-2.2 5-5V40c0-2.8-2.2-5-5-5zM35 35c-2.8 0-5 2.2-5 5v20c0 2.8 2.2 5 5 5s5-2.2 5-5V40c0-2.8-2.2-5-5-5zM50 45c-2.8 0-5 2.2-5 5v10c0 2.8 2.2 5 5 5s5-2.2 5-5V50c0-2.8-2.2-5-5-5z"/>
  </svg>
);

const Sidebar = ({ onCreateClick }) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { icon: HomeOutlined, activeIcon: HomeFilled, path: '/', label: 'Home' },
    { icon: SearchOutlined, activeIcon: SearchOutlined, path: '/search', label: 'Search' },
    { icon: PlusSquareOutlined, activeIcon: PlusSquareOutlined, path: '#create', label: 'Create', onClick: onCreateClick },
    { icon: HeartOutlined, activeIcon: HeartFilled, path: '/notifications', label: 'Notifications' },
    { icon: UserOutlined, activeIcon: UserOutlined, path: isAuthenticated && user ? `/${user.username}` : '/login', label: 'Profile' },
  ];

  const menuItems = [
    {
      key: 'theme',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          <Switch 
            checked={isDark} 
            onChange={toggleTheme} 
            size="small"
          />
        </div>
      ),
    },
    { type: 'divider' },
    ...(isAuthenticated ? [
      {
        key: 'liked',
        icon: <LikeOutlined />,
        label: <Link to="/liked">Liked Posts</Link>,
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: <Link to="/settings">Settings</Link>,
      },
      { type: 'divider' },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Log out',
        danger: true,
        onClick: logout,
      },
    ] : [
      {
        key: 'login',
        icon: <LoginOutlined />,
        label: <Link to="/login">Log in</Link>,
      },
      {
        key: 'signup',
        icon: <UserOutlined />,
        label: <Link to="/signup">Sign up</Link>,
      },
    ]),
  ];

  return (
    <Sider
      width={72}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        height: '100vh',
        background: isDark ? '#000' : '#fff',
        borderRight: `1px solid ${isDark ? '#262626' : '#e5e5e5'}`,
        zIndex: 100,
      }}
    >
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        height: '100%',
        padding: '16px 0',
      }}>
        {/* Logo */}
        <Link 
          to="/" 
          style={{ 
            padding: 12, 
            borderRadius: 8,
            color: isDark ? '#fff' : '#000',
            marginBottom: 16,
          }}
          className="sidebar-nav-item"
        >
          <StringsLogo />
        </Link>

        {/* Navigation */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map((item) => {
            const active = item.path !== '#create' && isActive(item.path);
            const Icon = active ? item.activeIcon : item.icon;
            
            if (item.onClick) {
              return (
                <Button
                  key={item.label}
                  type="text"
                  onClick={item.onClick}
                  style={{
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 8,
                    color: isDark ? '#737373' : '#737373',
                  }}
                  className="sidebar-nav-item"
                  icon={<Icon style={{ fontSize: 24 }} />}
                />
              );
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                style={{
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  color: active ? (isDark ? '#fff' : '#000') : (isDark ? '#737373' : '#737373'),
                }}
                className="sidebar-nav-item"
              >
                <Icon style={{ fontSize: 24 }} />
              </Link>
            );
          })}
        </nav>

        {/* Menu */}
        <Dropdown
          menu={{ items: menuItems }}
          trigger={['click']}
          placement="topRight"
        >
          <Button
            type="text"
            style={{
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              color: isDark ? '#737373' : '#737373',
            }}
            className="sidebar-nav-item"
            icon={<MenuOutlined style={{ fontSize: 24 }} />}
          />
        </Dropdown>
      </div>
    </Sider>
  );
};

export default Sidebar;

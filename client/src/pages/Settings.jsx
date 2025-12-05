/**
 * Settings Page
 * 
 * App settings and account management.
 */

import { Typography, Switch, Button } from 'antd';
import {
  BellOutlined,
  LockOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { message } from 'antd';

const { Title, Text } = Typography;

const Settings = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    message.success('Logged out successfully');
    navigate('/');
  };

  const settingSections = [
    {
      title: 'Preferences',
      items: [
        {
          icon: <BellOutlined />,
          label: 'Notifications',
          action: 'arrow',
        },
        {
          icon: <LockOutlined />,
          label: 'Privacy',
          action: 'arrow',
        },
        {
          label: 'Dark mode',
          action: 'switch',
          value: isDark,
          onChange: toggleTheme,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: <UserOutlined />,
          label: 'Account settings',
          action: 'arrow',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: <QuestionCircleOutlined />,
          label: 'Help',
          action: 'arrow',
        },
        {
          icon: <InfoCircleOutlined />,
          label: 'About',
          action: 'arrow',
        },
      ],
    },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${isDark ? '#262626' : '#e5e5e5'}`,
        padding: '16px',
      }}>
        <Title level={5} style={{ 
          margin: 0, 
          textAlign: 'center',
          color: isDark ? '#fff' : '#000',
        }}>
          Settings
        </Title>
      </header>

      {/* Settings Content */}
      <div style={{ padding: '8px 0', paddingBottom: 100 }}>
        {settingSections.map((section) => (
          <div key={section.title}>
            <Text style={{ 
              display: 'block',
              padding: '16px 16px 8px',
              fontSize: 13,
              color: isDark ? '#737373' : '#8c8c8c',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {section.title}
            </Text>
            
            <div style={{
              backgroundColor: isDark ? '#181818' : '#fff',
              margin: '0 16px',
              borderRadius: 12,
              border: `1px solid ${isDark ? '#262626' : '#e5e5e5'}`,
              overflow: 'hidden',
            }}>
              {section.items.map((item, itemIndex) => (
                <div 
                  key={item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderBottom: itemIndex < section.items.length - 1 
                      ? `1px solid ${isDark ? '#262626' : '#e5e5e5'}`
                      : 'none',
                    cursor: item.action === 'arrow' ? 'pointer' : 'default',
                  }}
                  className={item.action === 'arrow' ? 'hover-bg' : ''}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {item.icon && (
                      <span style={{ 
                        color: isDark ? '#737373' : '#8c8c8c',
                        fontSize: 18,
                      }}>
                        {item.icon}
                      </span>
                    )}
                    <Text style={{ color: isDark ? '#fff' : '#000' }}>
                      {item.label}
                    </Text>
                  </div>
                  
                  {item.action === 'switch' && (
                    <Switch 
                      checked={item.value} 
                      onChange={item.onChange}
                      size="small"
                    />
                  )}
                  {item.action === 'arrow' && (
                    <Text style={{ color: isDark ? '#404040' : '#d9d9d9' }}>›</Text>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        {isAuthenticated && (
          <div style={{ padding: '24px 16px' }}>
            <Button
              danger
              block
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{
                height: 48,
                borderRadius: 12,
                fontWeight: 600,
              }}
            >
              Log out
            </Button>
          </div>
        )}

        {/* App Info */}
        <div style={{ 
          textAlign: 'center', 
          padding: '24px 16px',
          color: isDark ? '#404040' : '#bfbfbf',
          fontSize: 12,
        }}>
          <p>Strings v1.0.0</p>
          <p>© 2024 Strings. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;

/**
 * Notifications Page
 * 
 * Shows user activity notifications.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Typography, Button, Tabs, Empty } from 'antd';
import { 
  HeartFilled, 
  MessageFilled, 
  RetweetOutlined, 
  UserAddOutlined,
  BellFilled,
} from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const { Title, Text } = Typography;

const mockNotifications = [

];

const Notifications = () => {
  const { isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('all');

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}>
        <div style={{ textAlign: 'center' }}>
          <BellFilled style={{ 
            fontSize: 48, 
            color: '#1890ff',
            marginBottom: 16,
          }} />
          <Title level={4} style={{ color: isDark ? '#fff' : '#000' }}>
            Login to see notifications
          </Title>
          <Text style={{ 
            color: isDark ? '#737373' : '#8c8c8c',
            display: 'block',
            marginBottom: 24,
          }}>
            You need to be logged in to view your notifications.
          </Text>
          <Link to="/login">
            <Button type="primary" size="large" style={{ borderRadius: 8 }}>
              Log in
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getIcon = (type) => {
    const iconStyle = { fontSize: 14 };
    switch (type) {
      case 'like':
        return <HeartFilled style={{ ...iconStyle, color: '#ff4d4f' }} />;
      case 'comment':
        return <MessageFilled style={{ ...iconStyle, color: '#1890ff' }} />;
      case 'repost':
        return <RetweetOutlined style={{ ...iconStyle, color: '#52c41a' }} />;
      case 'follow':
        return <UserAddOutlined style={{ ...iconStyle, color: '#722ed1' }} />;
      default:
        return null;
    }
  };

  const getMessage = (notification) => {
    switch (notification.type) {
      case 'like':
        return 'liked your thread';
      case 'comment':
        return 'replied to your thread';
      case 'repost':
        return 'reposted your thread';
      case 'follow':
        return 'started following you';
      default:
        return '';
    }
  };

  const tabItems = [
    { key: 'all', label: 'All' },
    { key: 'verified', label: 'Verified' },
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
      }}>
        <div style={{ padding: '16px' }}>
          <Title level={5} style={{ 
            margin: 0, 
            textAlign: 'center',
            color: isDark ? '#fff' : '#000',
          }}>
            Activity
          </Title>
        </div>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          centered
          style={{ marginBottom: 0 }}
        />
      </header>

      {/* Notifications List */}
      <div style={{ paddingBottom: 80 }}>
        {mockNotifications.length > 0 ? (
          mockNotifications.map((notification) => (
            <div 
              key={notification.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: 16,
                borderBottom: `1px solid ${isDark ? '#262626' : '#e5e5e5'}`,
                backgroundColor: !notification.read 
                  ? (isDark ? 'rgba(24, 144, 255, 0.05)' : 'rgba(24, 144, 255, 0.02)') 
                  : 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              className="hover-bg"
            >
              <div style={{ position: 'relative' }}>
                <Avatar 
                  size={40}
                  style={{ backgroundColor: isDark ? '#333' : '#f0f0f0' }}
                >
                  {notification.user.displayName.charAt(0)}
                </Avatar>
                <div style={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  backgroundColor: isDark ? '#181818' : '#fff',
                  borderRadius: '50%',
                  padding: 2,
                }}>
                  {getIcon(notification.type)}
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ color: isDark ? '#fff' : '#000' }}>
                  <Text strong>{notification.user.username}</Text>
                  {' '}
                  <Text style={{ color: isDark ? '#737373' : '#8c8c8c' }}>
                    {getMessage(notification)}
                  </Text>
                </Text>
                {notification.content && notification.type === 'comment' && (
                  <Text 
                    style={{ 
                      display: 'block',
                      color: isDark ? '#737373' : '#8c8c8c',
                      fontSize: 14,
                      marginTop: 4,
                    }}
                    ellipsis
                  >
                    {notification.content}
                  </Text>
                )}
                <Text style={{ 
                  fontSize: 12, 
                  color: isDark ? '#737373' : '#8c8c8c',
                  display: 'block',
                  marginTop: 4,
                }}>
                  {notification.timestamp}
                </Text>
              </div>
            </div>
          ))
        ) : (
          <Empty
            description={
              <Text style={{ color: isDark ? '#737373' : '#8c8c8c' }}>
                No notifications yet
              </Text>
            }
            style={{ padding: 40 }}
          />
        )}
      </div>
    </div>
  );
};

export default Notifications;

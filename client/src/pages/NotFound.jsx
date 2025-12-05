/**
 * 404 Not Found Page
 */

import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Typography, Button, Result } from 'antd';
import { useTheme } from '@/context/ThemeContext';

const { Title, Text } = Typography;

const NotFound = () => {
  const location = useLocation();
  const { isDark } = useTheme();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#000' : '#fafafa',
      padding: 24,
    }}>
      <div style={{ textAlign: 'center' }}>
        <Title style={{ 
          fontSize: 96, 
          margin: 0,
          color: isDark ? '#262626' : '#e5e5e5',
          fontWeight: 700,
        }}>
          404
        </Title>
        <Title level={3} style={{ 
          color: isDark ? '#fff' : '#000',
          marginBottom: 8,
        }}>
          Page not found
        </Title>
        <Text style={{ 
          color: isDark ? '#737373' : '#8c8c8c',
          display: 'block',
          marginBottom: 24,
        }}>
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <Link to="/">
          <Button type="primary" size="large" style={{ borderRadius: 8 }}>
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

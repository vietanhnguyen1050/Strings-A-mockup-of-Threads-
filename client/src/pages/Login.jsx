/**
 * Login Page
 * 
 * Supports login via email, username, or phone number.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Divider, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const result = await login(values.identifier, values.password);
      if (result.success) {
        message.success('Welcome back!');
        navigate('/');
      } else {
        message.error(result.error || 'Invalid credentials');
      }
    } catch (error) {
      message.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      backgroundColor: isDark ? '#000' : '#fafafa',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        padding: 32,
        backgroundColor: isDark ? '#181818' : '#fff',
        borderRadius: 16,
        border: `1px solid ${isDark ? '#262626' : '#e5e5e5'}`,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ 
            margin: 0, 
            color: isDark ? '#fff' : '#000',
            fontWeight: 700,
          }}>
            Strings
          </Title>
          <Text style={{ color: isDark ? '#737373' : '#8c8c8c' }}>
            Log in to continue
          </Text>
        </div>

        <Form
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
        >
          <Form.Item
            name="identifier"
            rules={[
              { required: true, message: 'Please enter your email, username, or phone' }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: isDark ? '#737373' : '#8c8c8c' }} />}
              placeholder="Email, username, or phone"
              style={{
                backgroundColor: isDark ? '#262626' : '#f5f5f5',
                borderColor: isDark ? '#404040' : '#d9d9d9',
                color: isDark ? '#fff' : '#000',
                borderRadius: 12,
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter your password' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: isDark ? '#737373' : '#8c8c8c' }} />}
              placeholder="Password"
              style={{
                backgroundColor: isDark ? '#262626' : '#f5f5f5',
                borderColor: isDark ? '#404040' : '#d9d9d9',
                borderRadius: 12,
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              style={{
                height: 48,
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Log in
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'right', marginBottom: 16 }}>
            <Link 
              to="/forgot-password"
              style={{ color: isDark ? '#737373' : '#8c8c8c', fontSize: 14 }}
            >
              Forgot password?
            </Link>
          </div>
        </Form>

        <Divider style={{ 
          borderColor: isDark ? '#262626' : '#e5e5e5',
          color: isDark ? '#737373' : '#8c8c8c',
        }}>
          or
        </Divider>

        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: isDark ? '#737373' : '#8c8c8c' }}>
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              style={{ 
                color: '#1890ff', 
                fontWeight: 600,
              }}
            >
              Sign up
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Login;

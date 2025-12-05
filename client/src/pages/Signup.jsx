/**
 * Signup Page
 * 
 * Registration with email, username, phone, password, and DOB (required).
 * Users must be at least 14 years old to sign up.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Divider, DatePicker, message } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const { Title, Text } = Typography;

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (values) => {
    // Check age
    const age = calculateAge(values.dob.toDate());
    if (age < 14) {
      message.error('You must be at least 14 years old to use Strings.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signup({
        email: values.email,
        username: values.username,
        displayName: values.displayName || values.username,
        phoneNumber: values.phone,
        password: values.password,
        dob: values.dob?.format('YYYY-MM-DD'),
      });

      if (result.success) {
        message.success('Account created successfully!');
        navigate('/');
      } else {
        message.error(result.error || 'Signup failed');
      }
    } catch (error) {
      message.error('Signup failed. Please try again.');
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
            Create your account
          </Text>
        </div>

        <Form
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: isDark ? '#737373' : '#8c8c8c' }} />}
              placeholder="Email"
              style={{
                backgroundColor: isDark ? '#262626' : '#f5f5f5',
                borderColor: isDark ? '#404040' : '#d9d9d9',
                color: isDark ? '#fff' : '#000',
                borderRadius: 12,
              }}
            />
          </Form.Item>

          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Please enter a username' },
              { min: 3, message: 'Username must be at least 3 characters' },
              { max: 20, message: 'Username must be at most 20 characters' },
              { 
                pattern: /^[a-zA-Z0-9_]+$/, 
                message: 'Username can only contain letters, numbers, and underscores' 
              }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: isDark ? '#737373' : '#8c8c8c' }} />}
              placeholder="Username"
              style={{
                backgroundColor: isDark ? '#262626' : '#f5f5f5',
                borderColor: isDark ? '#404040' : '#d9d9d9',
                color: isDark ? '#fff' : '#000',
                borderRadius: 12,
              }}
            />
          </Form.Item>

          <Form.Item
            name="displayName"
          >
            <Input
              prefix={<UserOutlined style={{ color: isDark ? '#737373' : '#8c8c8c' }} />}
              placeholder="Display Name (optional)"
              style={{
                backgroundColor: isDark ? '#262626' : '#f5f5f5',
                borderColor: isDark ? '#404040' : '#d9d9d9',
                color: isDark ? '#fff' : '#000',
                borderRadius: 12,
              }}
            />
          </Form.Item>

          <Form.Item
            name="phone"
          >
            <Input
              prefix={<PhoneOutlined style={{ color: isDark ? '#737373' : '#8c8c8c' }} />}
              placeholder="Phone number (optional)"
              style={{
                backgroundColor: isDark ? '#262626' : '#f5f5f5',
                borderColor: isDark ? '#404040' : '#d9d9d9',
                color: isDark ? '#fff' : '#000',
                borderRadius: 12,
              }}
            />
          </Form.Item>

          <Form.Item
            name="dob"
            rules={[
              { required: true, message: 'Date of birth is required' }
            ]}
          >
            <DatePicker
              placeholder="Date of Birth *"
              style={{
                width: '100%',
                backgroundColor: isDark ? '#262626' : '#f5f5f5',
                borderColor: isDark ? '#404040' : '#d9d9d9',
                borderRadius: 12,
              }}
              disabledDate={(current) => current && current.valueOf() > Date.now()}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter a password' },
              { min: 8, message: 'Password must be at least 8 characters' }
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

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: isDark ? '#737373' : '#8c8c8c' }} />}
              placeholder="Confirm Password"
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
              Sign up
            </Button>
          </Form.Item>

          <Text style={{ 
            display: 'block', 
            textAlign: 'center',
            fontSize: 12,
            color: isDark ? '#737373' : '#8c8c8c',
            marginBottom: 16,
          }}>
            By signing up, you agree to our Terms of Service and Privacy Policy.
            You must be at least 14 years old to use Strings.
          </Text>
        </Form>

        <Divider style={{ 
          borderColor: isDark ? '#262626' : '#e5e5e5',
          color: isDark ? '#737373' : '#8c8c8c',
        }}>
          or
        </Divider>

        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: isDark ? '#737373' : '#8c8c8c' }}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: '#1890ff', 
                fontWeight: 600,
              }}
            >
              Log in
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Signup;

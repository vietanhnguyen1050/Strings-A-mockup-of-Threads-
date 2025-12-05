/**
 * EditProfileModal Component
 * 
 * Modal for editing user profile (displayName, bio, avatar).
 * DOB is not editable after account creation.
 */

import { useState, useEffect } from 'react';
import { Modal, Button, Input, Avatar, Upload, message, Form } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { updateUserProfile } from '@/services/userService';

const { TextArea } = Input;

const EditProfileModal = ({ open, onClose, onUpdate }) => {
  const { user, updateUser } = useAuth();
  const { isDark } = useTheme();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({
        displayName: user.displayName || '',
        bio: user.bio || '',
      });
      setAvatarPreview(user.avatarUrl);
    }
  }, [open, user, form]);

  const handleAvatarChange = (info) => {
    const file = info.file;
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // In real implementation, upload avatar to Cloudinary first
      let avatarUrl = user.avatarUrl;
      if (avatarFile) {
        // Simulate upload - replace with actual Cloudinary upload
        avatarUrl = avatarPreview;
      }

      const result = await updateUserProfile(user.userId, {
        displayName: values.displayName,
        bio: values.bio,
        avatarUrl,
      });

      if (result.success) {
        updateUser(result.data);
        message.success('Profile updated successfully!');
        onUpdate?.(result.data);
        onClose();
      } else {
        message.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={null}
      closable={false}
      centered
      width={500}
      styles={{
        content: {
          backgroundColor: isDark ? '#181818' : '#fff',
          padding: 0,
        },
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: `1px solid ${isDark ? '#262626' : '#e5e5e5'}`,
      }}>
        <Button 
          type="text" 
          onClick={onClose}
          style={{ color: isDark ? '#fff' : '#000' }}
        >
          Cancel
        </Button>
        <span style={{ 
          fontWeight: 600, 
          color: isDark ? '#fff' : '#000',
          fontSize: 16,
        }}>
          Edit profile
        </span>
        <Button
          type="text"
          onClick={() => form.submit()}
          loading={isSubmitting}
          style={{ 
            color: '#1890ff',
            fontWeight: 600,
          }}
        >
          Done
        </Button>
      </div>

      {/* Content */}
      <div style={{ padding: 24 }}>
        {/* Avatar Upload */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: 24,
        }}>
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleAvatarChange}
            accept="image/*"
          >
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Avatar 
                size={96} 
                src={avatarPreview}
                style={{ backgroundColor: isDark ? '#333' : '#f0f0f0' }}
              >
                {user?.displayName?.charAt(0).toUpperCase()}
              </Avatar>
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: '#1890ff',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `3px solid ${isDark ? '#181818' : '#fff'}`,
              }}>
                <CameraOutlined style={{ color: '#fff', fontSize: 14 }} />
              </div>
            </div>
          </Upload>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="displayName"
            label={
              <span style={{ color: isDark ? '#fff' : '#000' }}>
                Display Name
              </span>
            }
            rules={[
              { required: true, message: 'Display name is required' },
              { max: 50, message: 'Maximum 50 characters' },
            ]}
          >
            <Input 
              placeholder="Enter display name"
              style={{
                backgroundColor: isDark ? '#262626' : '#f5f5f5',
                borderColor: isDark ? '#404040' : '#d9d9d9',
                color: isDark ? '#fff' : '#000',
              }}
            />
          </Form.Item>

          <Form.Item
            name="bio"
            label={
              <span style={{ color: isDark ? '#fff' : '#000' }}>
                Bio
              </span>
            }
            rules={[
              { max: 160, message: 'Maximum 160 characters' },
            ]}
          >
            <TextArea
              placeholder="Write a bio..."
              autoSize={{ minRows: 3, maxRows: 5 }}
              showCount
              maxLength={160}
              style={{
                backgroundColor: isDark ? '#262626' : '#f5f5f5',
                borderColor: isDark ? '#404040' : '#d9d9d9',
                color: isDark ? '#fff' : '#000',
              }}
            />
          </Form.Item>

          {/* Read-only fields */}
          <div style={{ 
            marginTop: 16,
            padding: 16,
            backgroundColor: isDark ? '#262626' : '#f5f5f5',
            borderRadius: 8,
          }}>
            <div style={{ 
              fontSize: 12, 
              color: isDark ? '#737373' : '#8c8c8c',
              marginBottom: 8,
            }}>
              Account Info (cannot be edited)
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
              <span style={{ color: isDark ? '#a3a3a3' : '#595959' }}>Username</span>
              <span style={{ color: isDark ? '#fff' : '#000' }}>@{user?.username}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
            }}>
              <span style={{ color: isDark ? '#a3a3a3' : '#595959' }}>Date of Birth</span>
              <span style={{ color: isDark ? '#fff' : '#000' }}>
                {user?.dob ? new Date(user.dob).toLocaleDateString() : 'Not set'}
              </span>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default EditProfileModal;

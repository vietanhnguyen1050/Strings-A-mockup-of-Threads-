/**
 * CreatePostModal Component
 * 
 * Modal for creating new posts with image upload support.
 * Sends actual files to backend as FormData.
 */

import { useState } from 'react';
import { Modal, Button, Avatar, Input, Upload, Space, message } from 'antd';
import { PictureOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/context/PostContext';
import { useTheme } from '@/context/ThemeContext';

const { TextArea } = Input;

const CreatePostModal = ({ open, onClose }) => {
  const { isAuthenticated, user } = useAuth();
  const { addPost } = usePosts();
  const { isDark } = useTheme();
  const [content, setContent] = useState('');
  const [fileList, setFileList] = useState([]);
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!content.trim() && fileList.length === 0) {
      message.warning('Please add some content or images');
      return;
    }

    setIsPosting(true);
    try {
      // Get actual file objects for upload
      const files = fileList.map(file => file.originFileObj).filter(Boolean);

      const result = await addPost(content.trim(), files);

      if (result.success) {
        message.success('Post created successfully!');
        setContent('');
        setFileList([]);
        onClose();
      } else {
        message.error(result.error || 'Failed to create post');
      }
    } catch (error) {
      message.error('Failed to create post');
    } finally {
      setIsPosting(false);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    if (newFileList.length > 10) {
      message.warning('Maximum 10 images allowed');
      return;
    }
    setFileList(newFileList);
  };

  const handleRemoveImage = (file) => {
    setFileList(fileList.filter(f => f.uid !== file.uid));
  };

  const uploadButton = (
    <div style={{ 
      width: 80, 
      height: 80, 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      border: `1px dashed ${isDark ? '#404040' : '#d9d9d9'}`,
      borderRadius: 8,
      cursor: 'pointer',
    }}>
      <PlusOutlined style={{ fontSize: 20, color: isDark ? '#737373' : '#8c8c8c' }} />
      <span style={{ fontSize: 12, marginTop: 4, color: isDark ? '#737373' : '#8c8c8c' }}>
        Upload
      </span>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        centered
        styles={{
          content: {
            backgroundColor: isDark ? '#181818' : '#fff',
            padding: 24,
          },
        }}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <h3 style={{ color: isDark ? '#fff' : '#000', marginBottom: 8 }}>
            Login Required
          </h3>
          <p style={{ color: isDark ? '#737373' : '#8c8c8c' }}>
            Please log in to create a post
          </p>
          <Button 
            type="primary" 
            href="/login"
            style={{ marginTop: 16 }}
          >
            Log In
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={null}
      closable={false}
      centered
      width={600}
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
          New thread
        </span>
        <div style={{ width: 60 }} />
      </div>

      {/* Content */}
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Avatar 
            size={40} 
            src={user?.avatar || user?.avatarUrl}
            style={{ backgroundColor: isDark ? '#333' : '#f0f0f0' }}
          >
            {user?.displayName?.charAt(0).toUpperCase()}
          </Avatar>
          
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontWeight: 600, 
              color: isDark ? '#fff' : '#000',
              marginBottom: 4,
            }}>
              {user?.username}
            </div>
            
            <TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start a thread..."
              autoSize={{ minRows: 3, maxRows: 10 }}
              bordered={false}
              style={{
                padding: 0,
                fontSize: 15,
                color: isDark ? '#fff' : '#000',
                backgroundColor: 'transparent',
                resize: 'none',
              }}
            />

            {/* Image Preview */}
            {fileList.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <Space wrap size={8}>
                  {fileList.map((file) => (
                    <div key={file.uid} style={{ position: 'relative' }}>
                      <img
                        src={file.url || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : '')}
                        alt="preview"
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: 8,
                        }}
                      />
                      <Button
                        type="text"
                        icon={<CloseOutlined />}
                        size="small"
                        onClick={() => handleRemoveImage(file)}
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          color: '#fff',
                          minWidth: 20,
                          height: 20,
                          padding: 0,
                          borderRadius: '50%',
                        }}
                      />
                    </div>
                  ))}
                  {fileList.length < 10 && (
                    <Upload
                      listType="picture-card"
                      fileList={[]}
                      onChange={handleUploadChange}
                      beforeUpload={() => false}
                      accept="image/*"
                      showUploadList={false}
                    >
                      {uploadButton}
                    </Upload>
                  )}
                </Space>
              </div>
            )}

            {/* Actions */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              marginTop: 12,
            }}>
              <Upload
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false}
                accept="image/*"
                multiple
                showUploadList={false}
              >
                <Button 
                  type="text" 
                  icon={<PictureOutlined />}
                  style={{ color: isDark ? '#737373' : '#8c8c8c' }}
                />
              </Upload>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderTop: `1px solid ${isDark ? '#262626' : '#e5e5e5'}`,
      }}>
        <span style={{ 
          fontSize: 13, 
          color: isDark ? '#737373' : '#8c8c8c',
        }}>
          Anyone can reply
        </span>
        <Button
          type="primary"
          onClick={handlePost}
          loading={isPosting}
          disabled={!content.trim() && fileList.length === 0}
          style={{
            borderRadius: 20,
            fontWeight: 600,
          }}
        >
          Post
        </Button>
      </div>
    </Modal>
  );
};

export default CreatePostModal;

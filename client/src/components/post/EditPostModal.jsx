/**
 * EditPostModal Component
 * 
 * Modal for editing existing post content.
 */

import { useState, useEffect } from 'react';
import { Modal, Button, Input, message } from 'antd';
import { useTheme } from '@/context/ThemeContext';
import { usePosts } from '@/context/PostContext';

const { TextArea } = Input;

const EditPostModal = ({ open, onClose, post }) => {
  const { isDark } = useTheme();
  const { editPost } = usePosts();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && post) {
      setContent(post.content || '');
    }
  }, [open, post]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      message.warning('Content cannot be empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await editPost(post.postId, content.trim());
      if (result.success) {
        message.success('Post updated successfully!');
        onClose();
      } else {
        message.error('Failed to update post');
      }
    } catch (error) {
      message.error('Failed to update post');
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
          Edit post
        </span>
        <Button
          type="text"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={!content.trim()}
          style={{ 
            color: content.trim() ? '#1890ff' : (isDark ? '#404040' : '#d9d9d9'),
            fontWeight: 600,
          }}
        >
          Save
        </Button>
      </div>

      {/* Content */}
      <div style={{ padding: 16 }}>
        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          autoSize={{ minRows: 4, maxRows: 10 }}
          style={{
            backgroundColor: isDark ? '#262626' : '#f5f5f5',
            borderColor: isDark ? '#404040' : '#d9d9d9',
            color: isDark ? '#fff' : '#000',
            fontSize: 15,
          }}
        />
      </div>
    </Modal>
  );
};

export default EditPostModal;

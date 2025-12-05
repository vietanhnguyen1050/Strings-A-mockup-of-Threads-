/**
 * CreatePostBox Component
 * 
 * Inline post creation box that appears on the feed.
 * Clicking opens the full CreatePostModal.
 */

import { useState } from 'react';
import { Avatar, Button } from 'antd';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import CreatePostModal from './CreatePostModal';

const CreatePostBox = () => {
  const { isAuthenticated, user } = useAuth();
  const { isDark } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          borderBottom: `1px solid ${isDark ? '#262626' : '#e5e5e5'}`,
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        className="hover-bg"
      >
        <Avatar 
          size={40} 
          src={user?.avatarUrl}
          style={{ backgroundColor: isDark ? '#333' : '#f0f0f0' }}
        >
          {user?.displayName?.charAt(0).toUpperCase()}
        </Avatar>
        
        <div style={{ 
          flex: 1, 
          color: isDark ? '#737373' : '#8c8c8c',
          fontSize: 15,
        }}>
          Start a thread...
        </div>

        <Button
          type="primary"
          size="small"
          style={{
            borderRadius: 20,
            fontWeight: 600,
            opacity: 0.5,
          }}
          disabled
        >
          Post
        </Button>
      </div>

      <CreatePostModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default CreatePostBox;

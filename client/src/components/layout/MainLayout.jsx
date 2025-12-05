/**
 * MainLayout Component
 * 
 * The main layout wrapper for authenticated pages.
 * Contains the sidebar navigation and main content area.
 */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './Sidebar';
import CreatePostModal from '@/components/post/CreatePostModal';
import { useTheme } from '@/context/ThemeContext';

const { Content } = Layout;

const MainLayout = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <Layout style={{ 
      minHeight: '100vh',
      background: isDark ? '#000' : '#fff',
    }}>
      <Sidebar onCreateClick={() => setIsCreateModalOpen(true)} />
      <Layout style={{ 
        marginLeft: 72,
        background: isDark ? '#000' : '#fff',
      }}>
        <Content>
          <div className="main-container">
            <Outlet />
          </div>
        </Content>
      </Layout>
      <CreatePostModal 
        open={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </Layout>
  );
};

export default MainLayout;

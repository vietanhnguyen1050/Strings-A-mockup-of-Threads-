import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import CreatePostModal from '@/components/post/CreatePostModal';

const MainLayout = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onCreateClick={() => setIsCreateModalOpen(true)} />
      <main className="ml-[72px] min-h-screen">
        <div className="max-w-[640px] mx-auto">
          <Outlet />
        </div>
      </main>
      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
};

export default MainLayout;

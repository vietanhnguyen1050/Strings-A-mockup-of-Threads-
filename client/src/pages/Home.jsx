import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { usePosts } from '@/context/PostContext';
import PostCard from '@/components/post/PostCard';
import CreatePostBox from '@/components/post/CreatePostBox';
import CreatePostModal from '@/components/post/CreatePostModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Home = () => {
  const { posts } = usePosts();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [feedType, setFeedType] = useState('foryou');

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-center py-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-base font-semibold hover:opacity-80 transition-opacity">
              {feedType === 'foryou' ? 'For you' : 'Following'}
              <ChevronDown size={18} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem 
                onClick={() => setFeedType('foryou')}
                className={feedType === 'foryou' ? 'bg-muted' : ''}
              >
                For you
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setFeedType('following')}
                className={feedType === 'following' ? 'bg-muted' : ''}
              >
                Following
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Create Post Box */}
      <CreatePostBox onClick={() => setIsCreateModalOpen(true)} />

      {/* Feed */}
      <div className="pb-20">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Floating Action Button for mobile */}
      <button 
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-foreground text-background rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity md:hidden"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      <CreatePostModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Home;

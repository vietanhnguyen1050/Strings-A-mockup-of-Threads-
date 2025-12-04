import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MoreHorizontal, Instagram, BarChart3 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/context/PostContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/post/PostCard';
import CreatePostBox from '@/components/post/CreatePostBox';
import CreatePostModal from '@/components/post/CreatePostModal';

const Profile = () => {
  const { username } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { posts } = usePosts();
  const [activeTab, setActiveTab] = useState('threads');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const isOwnProfile = isAuthenticated && user?.username === username;

  // Mock profile data (in real app, fetch from API)
  const profileData = isOwnProfile ? user : {
    id: 'mock',
    username: username || 'user',
    displayName: username || 'User',
    avatar: '',
    bio: 'Welcome to my Threads profile!',
    followers: Math.floor(Math.random() * 1000),
    following: Math.floor(Math.random() * 500),
  };

  const userPosts = posts.filter(post => 
    isOwnProfile ? post.author.id === user?.id : post.author.username === username
  );

  const tabs = [
    { id: 'threads', label: 'Threads' },
    { id: 'replies', label: 'Replies' },
    { id: 'reposts', label: 'Reposts' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="w-10" />
          <h1 className="text-base font-semibold">Profile</h1>
          <button className="p-2 rounded-full hover:bg-muted transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </header>

      {/* Profile Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{profileData?.displayName}</h2>
            <p className="text-muted-foreground">@{profileData?.username}</p>
          </div>
          <Avatar className="w-20 h-20">
            <AvatarImage src={profileData?.avatar} />
            <AvatarFallback className="text-2xl bg-muted text-muted-foreground">
              {profileData?.displayName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Bio */}
        {profileData?.bio && (
          <p className="text-foreground mb-3">{profileData.bio}</p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm mb-4">
          <span className="text-muted-foreground">
            <span className="text-foreground font-medium">{profileData?.followers}</span> followers
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">
            <span className="text-foreground font-medium">{profileData?.following}</span> following
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mb-4">
          {isOwnProfile ? (
            <>
              <Button variant="outline" className="flex-1 rounded-lg">
                Edit profile
              </Button>
              <button className="p-2 border border-border rounded-lg hover:bg-muted transition-colors">
                <BarChart3 size={20} />
              </button>
              <button className="p-2 border border-border rounded-lg hover:bg-muted transition-colors">
                <Instagram size={20} />
              </button>
            </>
          ) : (
            <>
              <Button className="flex-1 rounded-lg">
                Follow
              </Button>
              <Button variant="outline" className="flex-1 rounded-lg">
                Mention
              </Button>
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border -mx-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-foreground text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Create post box for own profile */}
      {isOwnProfile && (
        <CreatePostBox onClick={() => setIsCreateModalOpen(true)} />
      )}

      {/* Posts */}
      <div className="pb-20">
        {activeTab === 'threads' && (
          userPosts.length > 0 ? (
            userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              {isOwnProfile ? "You haven't posted any threads yet" : "No threads yet"}
            </div>
          )
        )}
        {activeTab === 'replies' && (
          <div className="py-12 text-center text-muted-foreground">
            No replies yet
          </div>
        )}
        {activeTab === 'reposts' && (
          <div className="py-12 text-center text-muted-foreground">
            No reposts yet
          </div>
        )}
      </div>

      <CreatePostModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Profile;

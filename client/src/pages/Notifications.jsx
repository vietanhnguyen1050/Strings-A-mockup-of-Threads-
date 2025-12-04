import { useState } from 'react';
import { Heart, MessageCircle, Repeat2, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

const mockNotifications = [
  {
    id: '1',
    type: 'follow',
    user: { username: 'hopefor_yours', displayName: 'Hope For Yours', avatar: '' },
    timestamp: '2h',
    read: false,
  },
  {
    id: '2',
    type: 'like',
    user: { username: '_vitamint_sea', displayName: 'Vitamin Sea', avatar: '' },
    content: 'liked your thread',
    timestamp: '4h',
    read: false,
  },
  {
    id: '3',
    type: 'comment',
    user: { username: 'huytarn', displayName: 'Huy Tarn', avatar: '' },
    content: 'Great post! Keep it up 🔥',
    timestamp: '1d',
    read: true,
  },
  {
    id: '4',
    type: 'repost',
    user: { username: 'purrienotfound', displayName: 'Purrie', avatar: '' },
    content: 'reposted your thread',
    timestamp: '2d',
    read: true,
  },
];

const Notifications = () => {
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState('all');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-2">Login to see notifications</h2>
          <p className="text-muted-foreground mb-4">
            You need to be logged in to view your notifications.
          </p>
          <Link 
            to="/login"
            className="inline-block px-6 py-2 bg-foreground text-background rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Log in
          </Link>
        </div>
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart size={16} className="text-red-500 fill-red-500" />;
      case 'comment':
        return <MessageCircle size={16} className="text-blue-500" />;
      case 'repost':
        return <Repeat2 size={16} className="text-green-500" />;
      case 'follow':
        return <UserPlus size={16} className="text-purple-500" />;
      default:
        return null;
    }
  };

  const getMessage = (notification) => {
    switch (notification.type) {
      case 'like':
        return 'liked your thread';
      case 'comment':
        return 'replied to your thread';
      case 'repost':
        return 'reposted your thread';
      case 'follow':
        return 'started following you';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="py-4 px-4">
          <h1 className="text-xl font-bold text-center">Activity</h1>
        </div>
        <div className="flex border-b border-border">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'border-b-2 border-foreground text-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              filter === 'verified' 
                ? 'border-b-2 border-foreground text-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            Verified
          </button>
        </div>
      </header>

      {/* Notifications List */}
      <div className="pb-20">
        {mockNotifications.map((notification) => (
          <div 
            key={notification.id}
            className={`flex items-start gap-3 p-4 border-b border-border hover:bg-threads-hover transition-colors cursor-pointer ${
              !notification.read ? 'bg-muted/30' : ''
            }`}
          >
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {notification.user.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 p-1 bg-background rounded-full">
                {getIcon(notification.type)}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-foreground">
                <span className="font-semibold">{notification.user.username}</span>
                {' '}
                <span className="text-muted-foreground">{getMessage(notification)}</span>
              </p>
              {notification.content && notification.type === 'comment' && (
                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                  {notification.content}
                </p>
              )}
              <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;

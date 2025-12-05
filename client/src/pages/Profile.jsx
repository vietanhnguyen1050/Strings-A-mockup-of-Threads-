/**
 * Profile Page
 * 
 * Displays user profile with posts, comments, likes, and reposts tabs.
 * Compatible with backend field names.
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Avatar, Button, Tabs, Typography, Spin, message } from 'antd';
import { 
  SettingOutlined, 
  CheckCircleFilled,
  EditOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/context/PostContext';
import { useTheme } from '@/context/ThemeContext';
import { getFullUserProfile, toggleFollow } from '@/services/userService';
import PostCard from '@/components/post/PostCard';
import CreatePostBox from '@/components/post/CreatePostBox';
import EditProfileModal from '@/components/profile/EditProfileModal';

const { Title, Text, Paragraph } = Typography;

const Profile = () => {
  const { username } = useParams();
  const { isAuthenticated, user: currentUser } = useAuth();
  const { posts } = usePosts();
  const { isDark } = useTheme();
  
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [repostedPosts, setRepostedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('threads');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const currentUserId = currentUser?._id || currentUser?.userId;
  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const result = await getFullUserProfile(username);
      if (result.success) {
        const data = result.data;
        setProfileUser(data);
        setUserPosts(data.posts || []);
        setUserComments(data.comments || []);
        setLikedPosts(data.likedPosts || []);
        setRepostedPosts(data.repostedPosts || []);
        
        // Check if current user follows this profile
        const followers = data.followers || [];
        setIsFollowing(followers.some(f => 
          f === currentUserId || f?._id === currentUserId
        ));
      } else {
        message.error('User not found');
      }
    } catch (error) {
      message.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated) {
      message.warning('Please log in to follow users');
      return;
    }

    try {
      const targetUserId = profileUser._id || profileUser.userId;
      const result = await toggleFollow(targetUserId);
      if (result.success) {
        setIsFollowing(result.data.isFollowing);
        setProfileUser(prev => ({
          ...prev,
          followersCount: result.data.followersCount,
        }));
      }
    } catch (error) {
      message.error('Failed to follow user');
    }
  };

  const tabItems = [
    { key: 'threads', label: 'Threads' },
    { key: 'replies', label: 'Replies' },
    { key: 'reposts', label: 'Reposts' },
    { key: 'liked', label: 'Liked' },
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case 'threads':
        return userPosts.filter(p => !p.replyingTo);
      case 'replies':
        return userComments;
      case 'reposts':
        return repostedPosts;
      case 'liked':
        return likedPosts;
      default:
        return [];
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '50vh',
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: 40,
        color: isDark ? '#737373' : '#8c8c8c',
      }}>
        <Title level={4} style={{ color: isDark ? '#fff' : '#000' }}>
          User not found
        </Title>
        <Link to="/">
          <Button type="primary">Go Home</Button>
        </Link>
      </div>
    );
  }

  const avatarUrl = profileUser.avatar || profileUser.avatarUrl || '';

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${isDark ? '#262626' : '#e5e5e5'}`,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ width: 40 }} />
        <Title level={5} style={{ margin: 0, color: isDark ? '#fff' : '#000' }}>
          {profileUser.displayName}
        </Title>
        {isOwnProfile && (
          <Button 
            type="text" 
            icon={<SettingOutlined />}
            onClick={() => {}}
            style={{ color: isDark ? '#fff' : '#000' }}
          />
        )}
      </header>

      {/* Profile Info */}
      <div style={{ padding: 16 }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: 16,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Title level={4} style={{ 
                margin: 0, 
                color: isDark ? '#fff' : '#000',
              }}>
                {profileUser.displayName}
              </Title>
              {profileUser.isVerified && (
                <CheckCircleFilled style={{ color: '#1890ff', fontSize: 18 }} />
              )}
            </div>
            <Text style={{ color: isDark ? '#737373' : '#8c8c8c' }}>
              @{profileUser.username}
            </Text>
          </div>
          <Avatar 
            size={80} 
            src={avatarUrl}
            style={{ backgroundColor: isDark ? '#333' : '#f0f0f0' }}
          >
            {profileUser.displayName?.charAt(0).toUpperCase()}
          </Avatar>
        </div>

        {/* Bio */}
        {profileUser.bio && (
          <Paragraph style={{ 
            color: isDark ? '#fff' : '#000',
            marginBottom: 12,
          }}>
            {profileUser.bio}
          </Paragraph>
        )}

        {/* Stats */}
        <div style={{ 
          display: 'flex', 
          gap: 16, 
          marginBottom: 16,
        }}>
          <Text style={{ color: isDark ? '#737373' : '#8c8c8c' }}>
            <span style={{ 
              fontWeight: 600, 
              color: isDark ? '#fff' : '#000',
              marginRight: 4,
            }}>
              {profileUser.followingCount || profileUser.following?.length || 0}
            </span>
            Following
          </Text>
          <Text style={{ color: isDark ? '#737373' : '#8c8c8c' }}>
            <span style={{ 
              fontWeight: 600, 
              color: isDark ? '#fff' : '#000',
              marginRight: 4,
            }}>
              {profileUser.followersCount || profileUser.followers?.length || 0}
            </span>
            Followers
          </Text>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          {isOwnProfile ? (
            <Button 
              block
              icon={<EditOutlined />}
              onClick={() => setIsEditModalOpen(true)}
              style={{
                borderRadius: 8,
                borderColor: isDark ? '#404040' : '#d9d9d9',
                color: isDark ? '#fff' : '#000',
              }}
            >
              Edit profile
            </Button>
          ) : (
            <>
              <Button 
                type={isFollowing ? 'default' : 'primary'}
                block
                onClick={handleFollow}
                style={{
                  borderRadius: 8,
                  fontWeight: 600,
                }}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button 
                block
                style={{
                  borderRadius: 8,
                  borderColor: isDark ? '#404040' : '#d9d9d9',
                  color: isDark ? '#fff' : '#000',
                }}
              >
                Mention
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        centered
        style={{ borderBottom: `1px solid ${isDark ? '#262626' : '#e5e5e5'}` }}
      />

      {/* Create Post Box (only on own profile) */}
      {isOwnProfile && activeTab === 'threads' && <CreatePostBox />}

      {/* Tab Content */}
      <div style={{ paddingBottom: 80 }}>
        {getTabContent().length > 0 ? (
          getTabContent().map((post) => (
            <PostCard key={post._id || post.postId} post={post} />
          ))
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: 40,
            color: isDark ? '#737373' : '#8c8c8c',
          }}>
            <p>No {activeTab} yet</p>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={(updatedUser) => setProfileUser(prev => ({ ...prev, ...updatedUser }))}
      />
    </div>
  );
};

export default Profile;

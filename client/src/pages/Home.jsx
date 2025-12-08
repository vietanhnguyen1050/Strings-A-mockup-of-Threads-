/**
 * Home Page
 * 
 * Main feed showing all posts.
 */

import { Typography, Tabs, Spin } from 'antd';
import { usePosts } from '@/context/PostContext';
import { useTheme } from '@/context/ThemeContext';
import PostCard from '@/components/post/PostCard';
import CreatePostBox from '@/components/post/CreatePostBox';

const { Title } = Typography;

const Home = () => {
  const { posts, isLoading } = usePosts();
  const { isDark } = useTheme();
  // Ensure posts is always an array
const feedPosts = (Array.isArray(posts?.data) ? posts.data.flat() : [])
  .filter(post => !post.replyingTo);
  // ...existing code...  console.log('Feed Posts:', feedPosts);
  const tabItems = [
    { key: 'for-you', label: 'For you' },
    { key: 'following', label: 'Following' },
  ];

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
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          padding: '12px 0',
        }}>
          <Title level={4} style={{ 
            margin: 0, 
            color: isDark ? '#fff' : '#000',
            fontWeight: 700,
          }}>
            Strings
          </Title>
        </div>
        <Tabs
          defaultActiveKey="for-you"
          items={tabItems}
          centered
          style={{ marginBottom: 0 }}
          tabBarStyle={{
            margin: 0,
            borderBottom: 'none',
          }}
        />
      </header>

      {/* Create Post Box */}
      <CreatePostBox />

      {/* Posts Feed */}
      <div style={{ paddingBottom: 80 }}>
        {isLoading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            padding: 40,
          }}>
            <Spin size="large" />
          </div>
        ) : feedPosts.length > 0 ? (
          feedPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: 40,
            color: isDark ? '#737373' : '#8c8c8c',
          }}>
            <p>No posts yet. Be the first to post!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

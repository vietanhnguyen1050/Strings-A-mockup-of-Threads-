
import { Link } from 'react-router-dom';
import { Typography, Button, Empty } from 'antd';
import { HeartFilled } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/context/PostContext';
import { useTheme } from '@/context/ThemeContext';
import PostCard from '@/components/post/PostCard';

const { Title, Text } = Typography;

const Liked = () => {
  const { isAuthenticated, user: currentUser } = useAuth();
  const { likedPosts } = usePosts();
  const { isDark } = useTheme();

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}>
        <div style={{ textAlign: 'center' }}>
          <HeartFilled style={{ 
            fontSize: 48, 
            color: '#ff4d4f',
            marginBottom: 16,
          }} />
          <Title level={4} style={{ color: isDark ? '#fff' : '#000' }}>
            Login to see liked posts
          </Title>
          <Text style={{ 
            color: isDark ? '#737373' : '#8c8c8c',
            display: 'block',
            marginBottom: 24,
          }}>
            You need to be logged in to view your liked posts.
          </Text>
          <Link to="/login">
            <Button type="primary" size="large" style={{ borderRadius: 8 }}>
              Log in
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
        padding: '16px',
      }}>
        <Title level={5} style={{ 
          margin: 0, 
          textAlign: 'center',
          color: isDark ? '#fff' : '#000',
        }}>
          Liked Posts
        </Title>
      </header>

      {/* Liked Posts */}
      <div style={{ paddingBottom: 80 }}>
        {likedPosts.length > 0 ? (
          likedPosts.map((post) => (
            <PostCard key={post.postId} post={post} />
          ))
        ) : (
          <Empty
            image={<HeartFilled style={{ fontSize: 64, color: isDark ? '#404040' : '#d9d9d9' }} />}
            description={
              <Text style={{ color: isDark ? '#737373' : '#8c8c8c' }}>
                You haven't liked any posts yet.
              </Text>
            }
            style={{ padding: 40 }}
          />
        )}
      </div>
    </div>
  );
};

export default Liked;

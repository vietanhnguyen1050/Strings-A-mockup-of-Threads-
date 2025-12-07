/**
 * Search Page
 * 
 * Search for posts and users.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Avatar, Button, Typography, Empty } from 'antd';
import { SearchOutlined, CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { usePosts } from '@/context/PostContext';
import { useTheme } from '@/context/ThemeContext';
import PostCard from '@/components/post/PostCard';

const { Text } = Typography;

// Mock suggested users
const suggestedUsers = [
  { id: '1', username: 'zuck', displayName: 'Mark Zuckerberg', followers: '3.2M', avatar: '', isVerified: true },
  { id: '2', username: 'instagram', displayName: 'Instagram', followers: '89M', avatar: '', isVerified: true },
  { id: '3', username: 'threads', displayName: 'Threads', followers: '12M', avatar: '', isVerified: true },
  { id: '4', username: 'meta', displayName: 'Meta', followers: '5.1M', avatar: '', isVerified: true },
];

const Search = () => {
  const { searchParams } = useParams();
  const navigate = useNavigate();
  const { posts } = usePosts();
  const { isDark } = useTheme();
  const [query, setQuery] = useState(searchParams || '');
  const [isSearching, setIsSearching] = useState(false);
  console.log(usePosts());

  useEffect(() => {
    if (searchParams) {
      setQuery(searchParams);
      setIsSearching(true);
    }
  }, [searchParams]);

  const handleSearch = (value) => {
    if (value.trim()) {
      navigate(`/search/${encodeURIComponent(value.trim())}`);
      setIsSearching(true);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setIsSearching(false);
    navigate('/search');
  };

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(query.toLowerCase()) ||
    post.author?.username.toLowerCase().includes(query.toLowerCase())
  );

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
        padding: 16,
      }}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onPressEnter={(e) => handleSearch(e.target.value)}
          placeholder="Search"
          prefix={<SearchOutlined style={{ color: isDark ? '#737373' : '#8c8c8c' }} />}
          suffix={query && (
            <CloseCircleFilled 
              onClick={clearSearch}
              style={{ color: isDark ? '#737373' : '#8c8c8c', cursor: 'pointer' }}
            />
          )}
          style={{
            backgroundColor: isDark ? '#262626' : '#f5f5f5',
            borderColor: 'transparent',
            borderRadius: 12,
          }}
        />
      </header>

      {/* Content */}
      {isSearching && query ? (
        <div style={{ paddingBottom: 80 }}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard key={post.postId} post={post} />
            ))
          ) : (
            <Empty
              description={
                <Text style={{ color: isDark ? '#737373' : '#8c8c8c' }}>
                  No results found for "{query}"
                </Text>
              }
              style={{ padding: 40 }}
            />
          )}
        </div>
      ) : (
        <div style={{ padding: 16 }}>
          <Text strong style={{ 
            display: 'block',
            marginBottom: 16,
            color: isDark ? '#fff' : '#000',
            fontSize: 16,
          }}>
            Suggested for you
          </Text>
          <div>
            {suggestedUsers.map((user) => (
              <div 
                key={user.id}
                onClick={() => navigate(`/${user.username}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 12,
                  borderRadius: 12,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                className="hover-bg"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar 
                    size={44}
                    src={user.avatar}
                    style={{ 
                      background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
                    }}
                  >
                    {user.displayName.charAt(0)}
                  </Avatar>
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 4,
                    }}>
                      <Text strong style={{ color: isDark ? '#fff' : '#000' }}>
                        {user.username}
                      </Text>
                      {user.isVerified && (
                        <CheckCircleFilled style={{ color: '#1890ff', fontSize: 14 }} />
                      )}
                    </div>
                    <Text style={{ color: isDark ? '#737373' : '#8c8c8c', fontSize: 13 }}>
                      {user.followers} followers
                    </Text>
                  </div>
                </div>
                <Button
                  style={{
                    borderRadius: 8,
                    borderColor: isDark ? '#404040' : '#d9d9d9',
                    color: isDark ? '#fff' : '#000',
                  }}
                >
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import { usePosts } from '@/context/PostContext';
import PostCard from '@/components/post/PostCard';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// Mock suggested users
const suggestedUsers = [
  { id: '1', username: 'zuck', displayName: 'Mark Zuckerberg', followers: '3.2M', avatar: '' },
  { id: '2', username: 'instagram', displayName: 'Instagram', followers: '89M', avatar: '' },
  { id: '3', username: 'threads', displayName: 'Threads', followers: '12M', avatar: '' },
  { id: '4', username: 'meta', displayName: 'Meta', followers: '5.1M', avatar: '' },
];

const Search = () => {
  const { searchParams } = useParams();
  const navigate = useNavigate();
  const { posts } = usePosts();
  const [query, setQuery] = useState(searchParams || '');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchParams) {
      setQuery(searchParams);
      setIsSearching(true);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${encodeURIComponent(query.trim())}`);
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
    post.author.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border p-4">
        <form onSubmit={handleSearch} className="relative">
          <SearchIcon 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="pl-10 pr-10 bg-muted border-none rounded-xl"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>
          )}
        </form>
      </header>

      {/* Content */}
      {isSearching && query ? (
        <div className="pb-20">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No results found for "{query}"</p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Suggested for you</h2>
          <div className="space-y-3">
            {suggestedUsers.map((user) => (
              <div 
                key={user.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-threads-hover transition-colors cursor-pointer"
                onClick={() => navigate(`/${user.username}`)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-11 h-11">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {user.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold flex items-center gap-1">
                      {user.username}
                      <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.52 3.59a3.29 3.29 0 0 1 6.96 0 3.29 3.29 0 0 1 4.93 4.93 3.29 3.29 0 0 1 0 6.96 3.29 3.29 0 0 1-4.93 4.93 3.29 3.29 0 0 1-6.96 0 3.29 3.29 0 0 1-4.93-4.93 3.29 3.29 0 0 1 0-6.96 3.29 3.29 0 0 1 4.93-4.93Z"/>
                        <path fill="white" d="m10.25 15.13-2.5-2.5 1.06-1.06 1.44 1.44 4.44-4.44 1.06 1.06-5.5 5.5Z"/>
                      </svg>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.followers} followers
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-full">
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

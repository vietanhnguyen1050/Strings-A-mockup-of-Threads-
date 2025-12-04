import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/context/PostContext';
import PostCard from '@/components/post/PostCard';

const Liked = () => {
  const { isAuthenticated } = useAuth();
  const { likedPosts } = usePosts();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-2">Login to see liked posts</h2>
          <p className="text-muted-foreground mb-4">
            You need to be logged in to view your liked posts.
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="py-4 px-4">
          <h1 className="text-xl font-bold text-center">Liked Posts</h1>
        </div>
      </header>

      {/* Liked Posts */}
      <div className="pb-20">
        {likedPosts.length > 0 ? (
          likedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              You haven't liked any posts yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Liked;

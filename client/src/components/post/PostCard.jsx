import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Repeat2, Send, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/context/PostContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

const PostCard = ({ post }) => {
  const { isAuthenticated } = useAuth();
  const { likePost, unlikePost, repostPost } = usePosts();
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);

  const handleLike = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to like posts",
        variant: "destructive",
      });
      return;
    }

    setIsLikeAnimating(true);
    setTimeout(() => setIsLikeAnimating(false), 400);

    if (post.isLiked) {
      unlikePost(post.id);
    } else {
      likePost(post.id);
    }
  };

  const handleRepost = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to repost",
        variant: "destructive",
      });
      return;
    }
    repostPost(post.id);
  };

  const handleComment = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to comment",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Coming soon",
      description: "Comment feature will be available soon",
    });
  };

  const handleShare = () => {
    toast({
      title: "Link copied",
      description: "Post link has been copied to clipboard",
    });
  };

  const formatCount = (count) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return count.toString();
  };

  return (
    <article className="px-4 py-3 border-b border-border animate-fadeIn hover:bg-threads-hover/50 transition-colors">
      <div className="flex gap-3">
        {/* Avatar */}
        <Link to={`/${post.author.username}`} className="flex-shrink-0">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.author.avatar} alt={post.author.displayName} />
            <AvatarFallback className="bg-muted text-muted-foreground text-sm">
              {post.author.displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Link 
                to={`/${post.author.username}`}
                className="font-semibold text-foreground hover:underline truncate"
              >
                {post.author.username}
              </Link>
              {post.author.isVerified && (
                <svg className="w-4 h-4 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.52 3.59a3.29 3.29 0 0 1 6.96 0 3.29 3.29 0 0 1 4.93 4.93 3.29 3.29 0 0 1 0 6.96 3.29 3.29 0 0 1-4.93 4.93 3.29 3.29 0 0 1-6.96 0 3.29 3.29 0 0 1-4.93-4.93 3.29 3.29 0 0 1 0-6.96 3.29 3.29 0 0 1 4.93-4.93Z"/>
                  <path fill="white" d="m10.25 15.13-2.5-2.5 1.06-1.06 1.44 1.44 4.44-4.44 1.06 1.06-5.5 5.5Z"/>
                </svg>
              )}
              <span className="text-muted-foreground text-sm">· {post.timestamp}</span>
            </div>
            <button className="p-1 rounded-full hover:bg-muted transition-colors">
              <MoreHorizontal size={18} className="text-muted-foreground" />
            </button>
          </div>

          {/* Post content */}
          <div className="mt-1 text-foreground whitespace-pre-wrap break-words">
            {post.content}
          </div>

          {/* Quoted post */}
          {post.quotedPost && (
            <div className="mt-3 p-3 border border-border rounded-xl bg-background">
              <div className="flex items-center gap-2 mb-1">
                <Avatar className="w-5 h-5">
                  <AvatarFallback className="text-xs">
                    {post.quotedPost.author.displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{post.quotedPost.author.username}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {post.quotedPost.content}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 mt-3 -ml-2">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1 p-2 rounded-full hover:bg-muted transition-colors group ${
                post.isLiked ? 'text-red-500' : ''
              }`}
            >
              <Heart 
                size={20} 
                className={`transition-all ${isLikeAnimating ? 'animate-heartBeat' : ''} ${
                  post.isLiked ? 'fill-red-500' : 'group-hover:text-red-500'
                }`}
              />
              {post.likes > 0 && (
                <span className="text-sm">{formatCount(post.likes)}</span>
              )}
            </button>

            <button 
              onClick={handleComment}
              className="flex items-center gap-1 p-2 rounded-full hover:bg-muted transition-colors group"
            >
              <MessageCircle size={20} className="group-hover:text-blue-500 transition-colors" />
              {post.comments > 0 && (
                <span className="text-sm">{formatCount(post.comments)}</span>
              )}
            </button>

            <button 
              onClick={handleRepost}
              className={`flex items-center gap-1 p-2 rounded-full hover:bg-muted transition-colors group ${
                post.isReposted ? 'text-green-500' : ''
              }`}
            >
              <Repeat2 size={20} className={`transition-colors ${
                post.isReposted ? '' : 'group-hover:text-green-500'
              }`} />
              {post.reposts > 0 && (
                <span className="text-sm">{formatCount(post.reposts)}</span>
              )}
            </button>

            <button 
              onClick={handleShare}
              className="flex items-center gap-1 p-2 rounded-full hover:bg-muted transition-colors group"
            >
              <Send size={20} className="group-hover:text-foreground transition-colors" />
              {post.shares > 0 && (
                <span className="text-sm">{formatCount(post.shares)}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;

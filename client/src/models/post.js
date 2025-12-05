/**
 * Post Model
 * 
 * This defines the structure of a Post in the Strings application.
 * Both independent posts and comments share this model.
 * 
 * Fields:
 * - postId: Unique identifier for the post
 * - userId: ID of the user who created the post
 * - content: Text content of the post
 * - media: Array of media URLs (images from Cloudinary, max 10)
 * - createdAt: Date the post was created
 * - reactions: Array of user IDs who reacted to the post
 * - comments: Array of post IDs that are replies to this post
 * - reposts: Array of user IDs who reposted this post
 * - replyingTo: If this is a comment, the post ID it's replying to (null if independent)
 * 
 * Note: A post is considered a "comment" if replyingTo is not null.
 * When a comment is created:
 * 1. The comment's replyingTo field contains the original post's ID
 * 2. The original post's comments array includes the comment's post ID
 */

// Default post structure
export const createEmptyPost = () => ({
  postId: '',
  userId: '',
  content: '',
  media: [],
  createdAt: new Date().toISOString(),
  reactions: [],
  comments: [],
  reposts: [],
  replyingTo: null,
});

// Create a new independent post
export const createPost = ({
  userId,
  content,
  media = [],
}) => ({
  postId: `post_${Date.now()}`,
  userId,
  content,
  media,
  createdAt: new Date().toISOString(),
  reactions: [],
  comments: [],
  reposts: [],
  replyingTo: null,
});

// Create a comment (post that replies to another post)
export const createComment = ({
  userId,
  content,
  media = [],
  replyingTo, // The post ID this comment is replying to
}) => ({
  postId: `post_${Date.now()}`,
  userId,
  content,
  media,
  createdAt: new Date().toISOString(),
  reactions: [],
  comments: [],
  reposts: [],
  replyingTo,
});

// Check if a post is a comment
export const isComment = (post) => post.replyingTo !== null;

// Validate post data
export const validatePostData = (postData) => {
  const errors = {};
  
  if (!postData.content || postData.content.trim().length === 0) {
    errors.content = 'Post content is required';
  }
  
  if (postData.content && postData.content.length > 500) {
    errors.content = 'Post content must be less than 500 characters';
  }
  
  if (postData.media && postData.media.length > 10) {
    errors.media = 'Maximum 10 images allowed per post';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Get post statistics
export const getPostStats = (post) => ({
  reactionsCount: post.reactions?.length || 0,
  commentsCount: post.comments?.length || 0,
  repostsCount: post.reposts?.length || 0,
});

// Format post for display (enriched with author data)
export const formatPostForDisplay = (post, author) => ({
  ...post,
  author: {
    userId: author.userId,
    username: author.username,
    displayName: author.displayName,
    avatarUrl: author.avatarUrl,
  },
  stats: getPostStats(post),
});

/**
 * User Model
 * 
 * This defines the structure of a User in the Strings application.
 * 
 * Fields:
 * - userId: Unique identifier for the user
 * - username: Unique username (used for login and @mentions)
 * - displayName: User's display name
 * - dob: Date of birth (not editable after creation)
 * - phoneNumber: Phone number (can be used for login)
 * - email: Email address (can be used for login)
 * - passwordHash: Hashed password (never exposed to frontend)
 * - createdAt: Account creation date
 * - avatarUrl: Profile picture URL from Cloudinary
 * - bio: User biography
 * - posts: Array of post IDs created by user
 * - comments: Array of post IDs that are comments (dependent posts)
 * - likedPosts: Array of post IDs the user has liked
 * - repostedPosts: Array of post IDs the user has reposted
 * - followers: Array of user IDs following this user
 * - following: Array of user IDs this user follows
 */

// Default user structure
export const createEmptyUser = () => ({
  userId: '',
  username: '',
  displayName: '',
  dob: null,
  phoneNumber: '',
  email: '',
  createdAt: new Date().toISOString(),
  avatarUrl: '',
  bio: '',
  posts: [],
  comments: [],
  likedPosts: [],
  repostedPosts: [],
  followers: [],
  following: [],
});

// Create a new user (for signup)
export const createUser = ({
  username,
  displayName,
  dob,
  phoneNumber,
  email,
  avatarUrl = '',
  bio = '',
}) => ({
  userId: `user_${Date.now()}`,
  username,
  displayName,
  dob,
  phoneNumber,
  email,
  createdAt: new Date().toISOString(),
  avatarUrl,
  bio,
  posts: [],
  comments: [],
  likedPosts: [],
  repostedPosts: [],
  followers: [],
  following: [],
});

// Validate user data for signup
export const validateUserData = (userData) => {
  const errors = {};
  
  if (!userData.username || userData.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }
  
  if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.email = 'Invalid email address';
  }
  
  if (!userData.displayName || userData.displayName.length < 1) {
    errors.displayName = 'Display name is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// User profile for display (excludes sensitive data)
export const getUserProfile = (user) => ({
  userId: user.userId,
  username: user.username,
  displayName: user.displayName,
  avatarUrl: user.avatarUrl,
  bio: user.bio,
  createdAt: user.createdAt,
  postsCount: user.posts?.length || 0,
  commentsCount: user.comments?.length || 0,
  likedPostsCount: user.likedPosts?.length || 0,
  repostedPostsCount: user.repostedPosts?.length || 0,
  followersCount: user.followers?.length || 0,
  followingCount: user.following?.length || 0,
});

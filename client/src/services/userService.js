/**
 * User Service
 * 
 * API endpoints for user operations.
 * Connects to backend: GET /api/users/:id
 * 
 * Backend returns:
 * {
 *   user,
 *   posts,
 *   comments,
 *   likedPosts,
 *   repostedPosts,
 *   followers,
 *   following
 * }
 */

import api, { uploadFormData } from '@/api/axios';

// Get user by ID (full profile with all data)
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'User not found';
    return { success: false, error: message };
  }
};

// Get user by username
export const getUserByUsername = async (username) => {
  try {
    const response = await api.get(`/users/username/${username}`);
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'User not found';
    return { success: false, error: message };
  }
};

// Get full user profile (by username)
export const getFullUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/profile`);
    const data = response.data;
    
    return {
      success: true,
      data: {
        ...data.user,
        posts: data.posts || [],
        comments: data.comments || [],
        likedPosts: data.likedPosts || [],
        repostedPosts: data.repostedPosts || [],
        followers: data.followers || [],
        following: data.following || [],
        followersCount: data.followers?.length || 0,
        followingCount: data.following?.length || 0,
      },
    };
  } catch (error) {
    const message = error.response?.data?.message || 'User not found';
    return { success: false, error: message };
  }
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    // Check if there's an avatar file to upload
    if (updates.avatarFile) {
      const formData = new FormData();
      formData.append('avatar', updates.avatarFile);
      if (updates.displayName) formData.append('displayName', updates.displayName);
      if (updates.bio !== undefined) formData.append('bio', updates.bio);
      
      const response = await uploadFormData(`/users/${userId}`, formData);
      return { success: true, data: response.data };
    }
    
    // Regular JSON update
    const response = await api.patch(`/users/${userId}`, updates);
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update profile';
    return { success: false, error: message };
  }
};

// Follow/unfollow user
export const toggleFollow = async (targetUserId) => {
  try {
    const response = await api.post(`/users/${targetUserId}/follow`);
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to follow user';
    return { success: false, error: message };
  }
};

// Check if username is available
export const checkUsernameAvailable = async (username) => {
  try {
    const response = await api.get(`/users/check-username/${username}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: true, data: { available: false } };
  }
};

export default {
  getUserById,
  getUserByUsername,
  getFullUserProfile,
  updateUserProfile,
  toggleFollow,
  checkUsernameAvailable,
};

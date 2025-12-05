/**
 * Post Service
 * 
 * API endpoints for post operations.
 * Connects to backend:
 * - GET /api/posts
 * - GET /api/posts/:id
 * - POST /api/posts (with multipart/form-data)
 * - PATCH /api/posts/:id/like
 * - PATCH /api/posts/:id/repost
 */

import api, { uploadFormData } from '@/api/axios';

// Get all posts (main feed - excludes comments)
export const getAllPosts = async () => {
  try {
    const response = await api.get('/posts');
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch posts';
    return { success: false, error: message };
  }
};

// Get specific post by ID with its comments
export const getPostById = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}`);
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch post';
    return { success: false, error: message };
  }
};

// Create new post (with image upload support)
export const createPost = async (postData) => {
  try {
    const formData = new FormData();
    formData.append('content', postData.content);
    
    // Append media files if any
    if (postData.media && postData.media.length > 0) {
      postData.media.forEach((file) => {
        formData.append('media', file);
      });
    }
    
    const response = await uploadFormData('/posts', formData);
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create post';
    return { success: false, error: message };
  }
};

// Create comment on a post
export const createComment = async (postId, commentData) => {
  try {
    const formData = new FormData();
    formData.append('content', commentData.content);
    
    // Append media files if any
    if (commentData.media && commentData.media.length > 0) {
      commentData.media.forEach((file) => {
        formData.append('media', file);
      });
    }
    
    // Use query param for replyingTo
    const response = await uploadFormData(`/posts?replyingTo=${postId}`, formData);
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create comment';
    return { success: false, error: message };
  }
};

// React to a post (like/unlike)
export const reactToPost = async (postId) => {
  try {
    const response = await api.patch(`/posts/${postId}/like`);
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to react to post';
    return { success: false, error: message };
  }
};

// Repost
export const repostPost = async (postId) => {
  try {
    const response = await api.patch(`/posts/${postId}/repost`);
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to repost';
    return { success: false, error: message };
  }
};

// Edit post
export const editPost = async (postId, content) => {
  try {
    const response = await api.patch(`/posts/${postId}`, { content });
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to edit post';
    return { success: false, error: message };
  }
};

// Delete post
export const deletePost = async (postId) => {
  try {
    await api.delete(`/posts/${postId}`);
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete post';
    return { success: false, error: message };
  }
};

export default {
  getAllPosts,
  getPostById,
  createPost,
  createComment,
  reactToPost,
  repostPost,
  editPost,
  deletePost,
};

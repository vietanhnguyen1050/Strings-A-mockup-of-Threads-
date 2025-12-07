/**
 * Post Context
 * 
 * Manages post state throughout the application.
 * Connects to postService for API calls.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import postService from '@/services/postService';

const PostContext = createContext(undefined);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch posts on mount
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await postService.getAllPosts();
      if (result.success) {
        setPosts(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const addPost = async (content, media = []) => {
    const result = await postService.createPost({ content, media });
    if (result.success) {
      await fetchPosts(); // Refetch to get updated data
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
  };

  const addComment = async (postId, content, media = []) => {
    const result = await postService.createComment(postId, { content, media });
    if (result.success) {
      await fetchPosts();
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
  };

  const likePost = async (postId) => {
    const result = await postService.reactToPost(postId);
    if (result.success) {
      const userId = localStorage.getItem('userId');
      setPosts(prev => Array.isArray(prev) ? prev.map(post => {
        const id = post._id || post.postId;
        if (id === postId) {
          const reacts = post.reacts || post.reactions || [];
          const hasLiked = reacts.includes(userId);
          return {
            ...post,
            reacts: hasLiked 
              ? reacts.filter(id => id !== userId)
              : [...reacts, userId],
          };
        }
        return post;
      }) : prev);
      return { success: true, data: result.data };
    }
    return { success: false };
  };

  const repostPost = async (postId) => {
    const result = await postService.repostPost(postId);
    if (result.success) {
      const userId = localStorage.getItem('userId');
      setPosts(prev => Array.isArray(prev) ? prev.map(post => {
        const id = post._id || post.postId;
        if (id === postId) {
          const reposts = post.repostedBy || post.reposts || [];
          const hasReposted = reposts.includes(userId);
          return {
            ...post,
            repostedBy: hasReposted 
              ? reposts.filter(id => id !== userId)
              : [...reposts, userId],
          };
        }
        return post;
      }) : prev);
      return { success: true, data: result.data };
    }
    return { success: false };
  };

  const editPost = async (postId, content) => {
    const result = await postService.editPost(postId, content);
    if (result.success) {
      setPosts(prev => Array.isArray(prev) ? prev.map(post => {
        const id = post._id || post.postId;
        if (id === postId) {
          return { ...post, content };
        }
        return post;
      }) : prev);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const deletePost = async (postId) => {
    const result = await postService.deletePost(postId);
    if (result.success) {
      setPosts(prev => Array.isArray(prev) ? prev.filter(post => {
        const id = post._id || post.postId;
        return id !== postId;
      }) : prev);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const getPostById = async (postId) => {
    return await postService.getPostById(postId);
  };

  const getLikedPosts = (userId) => {
    return Array.isArray(posts) ? posts.filter(post => {
      const reacts = post.reacts || post.reactions || [];
      return reacts.includes(userId);
    }) : [];
  };

  const getRepostedPosts = (userId) => {
    return Array.isArray(posts) ? posts.filter(post => {
      const reposts = post.repostedBy || post.reposts || [];
      return reposts.includes(userId);
    }) : [];
  };

  return (
    <PostContext.Provider value={{ 
      posts, 
      isLoading,
      fetchPosts,
      addPost, 
      addComment,
      likePost, 
      repostPost,
      editPost,
      deletePost,
      getPostById,
      getLikedPosts,
      getRepostedPosts,
    }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};

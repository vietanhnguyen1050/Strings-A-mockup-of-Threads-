import { createContext, useContext, useState } from 'react';

const PostContext = createContext(undefined);

// Mock data
const initialPosts = [
  {
    id: '1',
    author: {
      id: '2',
      username: '_vitamint_sea',
      displayName: 'Vitamin Sea',
      avatar: '',
      isVerified: true,
    },
    content: 'Là một sinh viên DAV (bàn chả liên quan gì đến mấy bản các anh chị làm, tôi đủ vì tôi thấy vui):\n- TAO KHÔNG CÓ GIỎI NÓI CHUYỆN ẤY???\n- t thật sự không quan tâm quá nhiều đến chính trị\n- t không phải cocc, không có định hướng làm nhà nước',
    timestamp: '2d',
    likes: 142,
    comments: 22,
    reposts: 21,
    shares: 10,
    isLiked: false,
    isReposted: false,
  },
  {
    id: '2',
    author: {
      id: '3',
      username: 'huytarn',
      displayName: 'Huy Tarn',
      avatar: '',
    },
    content: 'thi thuyết trình tacn chưa chat',
    timestamp: '2d',
    likes: 0,
    comments: 1,
    reposts: 0,
    shares: 0,
    isLiked: false,
    isReposted: false,
  },
  {
    id: '3',
    author: {
      id: '4',
      username: 'hopefor_yours',
      displayName: 'Hope For Yours',
      avatar: '',
      isVerified: true,
    },
    content: '[diary của người yêu roommate] 22/11/2025\n\nMình có chút không hài lòng với hành động cổ vừa làm, nên quyết định im lặng một chút để hạ hoả, tranh thủ dọn dẹp lại đồ đạc để đầu óc mình mẩn hơn.',
    timestamp: '12h',
    likes: 1200,
    comments: 21,
    reposts: 41,
    shares: 24,
    isLiked: false,
    isReposted: false,
  },
  {
    id: '4',
    author: {
      id: '5',
      username: 'purrienotfound',
      displayName: 'Purrie',
      avatar: '',
    },
    content: 'là 1 sinh viên dav:\n- t không phải cocc, cũng k có ý định làm nhà nước\n- t không tham gia bất kì clb nào, vẫn có bạn bè và happi happi\n- t không đi dạy tiếng anh\n- t không thích đồ ăn chùa láng cho lắm',
    timestamp: '2d',
    likes: 89,
    comments: 15,
    reposts: 8,
    shares: 3,
    isLiked: false,
    isReposted: false,
  },
];

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [likedPosts, setLikedPosts] = useState([]);

  const addPost = (content, authorId, authorUsername, authorDisplayName) => {
    const newPost = {
      id: Date.now().toString(),
      author: {
        id: authorId,
        username: authorUsername,
        displayName: authorDisplayName,
        avatar: '',
      },
      content,
      timestamp: 'now',
      likes: 0,
      comments: 0,
      reposts: 0,
      shares: 0,
      isLiked: false,
      isReposted: false,
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const likePost = (postId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const updatedPost = { ...post, isLiked: true, likes: post.likes + 1 };
        setLikedPosts(liked => {
          if (!liked.find(p => p.id === postId)) {
            return [updatedPost, ...liked];
          }
          return liked;
        });
        return updatedPost;
      }
      return post;
    }));
  };

  const unlikePost = (postId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, isLiked: false, likes: post.likes - 1 };
      }
      return post;
    }));
    setLikedPosts(prev => prev.filter(post => post.id !== postId));
  };

  const repostPost = (postId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, isReposted: !post.isReposted, reposts: post.isReposted ? post.reposts - 1 : post.reposts + 1 };
      }
      return post;
    }));
  };

  return (
    <PostContext.Provider value={{ posts, likedPosts, addPost, likePost, unlikePost, repostPost }}>
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

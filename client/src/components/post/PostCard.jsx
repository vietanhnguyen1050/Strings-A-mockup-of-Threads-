/**
 * PostCard Component
 * 
 * Displays a single post with author info, content, and actions.
 * Compatible with backend field names (_id, reacts, repostedBy).
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button, Space, Typography, Image, message, Dropdown, Modal, Carousel } from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  RetweetOutlined,
  ShareAltOutlined,
  MoreOutlined,
  CheckCircleFilled,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import EditPostModal from './EditPostModal';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/context/PostContext';
import { useTheme } from '@/context/ThemeContext';
import PostDetailModal from './PostDetailModal';

const { Text, Paragraph } = Typography;

const PostCard = ({ post }) => {
  const { isAuthenticated, user } = useAuth();
  const { likePost, repostPost, deletePost } = usePosts();
  const { isDark } = useTheme();
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  // Get post ID (support both _id and postId)
  const postId = post._id || post.postId;
  
  // Get author info (support both author object and userId with populated data)
  const author = post.author || post.userId || {};
  const authorUsername = author.username || '';
  const authorDisplayName = author.displayName || authorUsername;
  const authorAvatar = author.avatar || author.avatarUrl || '';
  const isVerified = author.isVerified || false;

  // Get reactions (support both reacts and reactions)
  const reactions = post.reacts || post.reactions || [];
  const reposts = post.repostedBy || post.reposts || [];
  const comments = post.comments || [];

  // Check user interactions
  const userId = user?._id || user?.userId;
  const hasLiked = userId && reactions.some(id => id === userId || id?._id === userId);
  const hasReposted = userId && reposts.some(id => id === userId || id?._id === userId);
  const isOwnPost = userId && (author._id === userId || author.userId === userId || authorUsername === user?.username);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      message.warning('Please log in to like posts');
      return;
    }

    setIsLikeAnimating(true);
    setTimeout(() => setIsLikeAnimating(false), 400);
    await likePost(postId);
  };

  const handleRepost = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      message.warning('Please log in to repost');
      return;
    }
    await repostPost(postId);
  };

  const handleComment = (e) => {
    e.stopPropagation();
    setIsDetailModalOpen(true);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
    message.success('Link copied to clipboard');
  };

  const formatCount = (count) => {
    if (!count) return '';
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return count.toString();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (hours < 1) return 'now';
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const handleImageClick = (e, index) => {
    e.stopPropagation();
    setPreviewIndex(index);
    setPreviewVisible(true);
  };

  const CarouselArrow = ({ direction, onClick }) => (
    <Button
      type="text"
      icon={direction === 'left' ? <LeftOutlined /> : <RightOutlined />}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        [direction]: 8,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: '#fff',
        borderRadius: '50%',
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );

  return (
    <>
      <article 
        className="post-card animate-fadeIn"
        onClick={() => setIsDetailModalOpen(true)}
        style={{
          padding: '12px 16px',
          borderBottom: `1px solid ${isDark ? '#262626' : '#e5e5e5'}`,
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
      >
        <div style={{ display: 'flex', gap: 12 }}>
          {/* Avatar */}
          <Link 
            to={`/${authorUsername}`} 
            onClick={(e) => e.stopPropagation()}
          >
            <Avatar 
              size={40} 
              src={authorAvatar}
              style={{ backgroundColor: isDark ? '#333' : '#f0f0f0' }}
            >
              {authorDisplayName?.charAt(0).toUpperCase()}
            </Avatar>
          </Link>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Space size={4}>
                <Link 
                  to={`/${authorUsername}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{ 
                    fontWeight: 600, 
                    color: isDark ? '#fff' : '#000',
                    textDecoration: 'none',
                  }}
                >
                  {authorUsername}
                </Link>
                {isVerified && (
                  <CheckCircleFilled style={{ color: '#1890ff', fontSize: 14 }} />
                )}
                <Text type="secondary" style={{ fontSize: 14 }}>
                  · {formatTime(post.createdAt)}
                </Text>
              </Space>
              {isOwnPost ? (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'edit',
                        label: 'Edit',
                        icon: <EditOutlined />,
                        onClick: (e) => {
                          e.domEvent.stopPropagation();
                          setIsEditModalOpen(true);
                        },
                      },
                      {
                        key: 'delete',
                        label: 'Delete',
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: (e) => {
                          e.domEvent.stopPropagation();
                          Modal.confirm({
                            title: 'Delete post?',
                            icon: <ExclamationCircleOutlined />,
                            content: 'This action cannot be undone.',
                            okText: 'Delete',
                            okType: 'danger',
                            onOk: () => deletePost(postId),
                          });
                        },
                      },
                    ],
                  }}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <Button 
                    type="text" 
                    icon={<MoreOutlined />} 
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                    style={{ color: isDark ? '#737373' : '#737373' }}
                  />
                </Dropdown>
              ) : (
                <Button 
                  type="text" 
                  icon={<MoreOutlined />} 
                  size="small"
                  onClick={(e) => e.stopPropagation()}
                  style={{ color: isDark ? '#737373' : '#737373' }}
                />
              )}
            </div>

            {/* Post content */}
            <Paragraph
              style={{ 
                margin: '4px 0 0 0',
                color: isDark ? '#fff' : '#000',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {post.content}
            </Paragraph>

            {/* Media - Carousel for multiple images */}
            {post.media && post.media.length > 0 && (
              <div 
                style={{ 
                  marginTop: 12, 
                  position: 'relative',
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {post.media.length === 1 ? (
                  <div 
                    style={{ 
                      height: 300,
                      borderRadius: 12,
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                    onClick={(e) => handleImageClick(e, 0)}
                  >
                    <img
                      src={post.media[0]}
                      alt="Post media"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <Carousel
                      dots={{ className: 'carousel-dots' }}
                      arrows
                      prevArrow={<CarouselArrow direction="left" />}
                      nextArrow={<CarouselArrow direction="right" />}
                    >
                      {post.media.map((url, index) => (
                        <div key={index}>
                          <div 
                            style={{ 
                              height: 300,
                              cursor: 'pointer',
                            }}
                            onClick={(e) => handleImageClick(e, index)}
                          >
                            <img
                              src={url}
                              alt={`Post media ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </Carousel>
                    <div style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: '#fff',
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontSize: 12,
                    }}>
                      {post.media.length} photos
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Image Preview Modal */}
            <Image.PreviewGroup
              preview={{
                visible: previewVisible,
                onVisibleChange: (vis) => setPreviewVisible(vis),
                current: previewIndex,
              }}
            >
              {post.media?.map((url, index) => (
                <Image key={index} src={url} style={{ display: 'none' }} />
              ))}
            </Image.PreviewGroup>

            {/* Actions */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4, 
              marginTop: 12,
              marginLeft: -8,
            }}>
              <Button
                type="text"
                onClick={handleLike}
                style={{
                  color: hasLiked ? '#ff4d4f' : (isDark ? '#737373' : '#737373'),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
                icon={
                  hasLiked ? (
                    <HeartFilled 
                      style={{ 
                        fontSize: 18,
                        color: '#ff4d4f',
                      }} 
                      className={isLikeAnimating ? 'animate-heartBeat' : ''}
                    />
                  ) : (
                    <HeartOutlined style={{ fontSize: 18 }} />
                  )
                }
              >
                {formatCount(reactions.length)}
              </Button>

              <Button
                type="text"
                onClick={handleComment}
                style={{
                  color: isDark ? '#737373' : '#737373',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
                icon={<MessageOutlined style={{ fontSize: 18 }} />}
              >
                {formatCount(comments.length)}
              </Button>

              <Button
                type="text"
                onClick={handleRepost}
                style={{
                  color: hasReposted ? '#52c41a' : (isDark ? '#737373' : '#737373'),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
                icon={<RetweetOutlined style={{ fontSize: 18, color: hasReposted ? '#52c41a' : undefined }} />}
              >
                {formatCount(reposts.length)}
              </Button>

              <Button
                type="text"
                onClick={handleShare}
                style={{
                  color: isDark ? '#737373' : '#737373',
                }}
                icon={<ShareAltOutlined style={{ fontSize: 18 }} />}
              />
            </div>
          </div>
        </div>
      </article>

      <PostDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        postId={postId}
      />

      <EditPostModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        post={post}
      />
    </>
  );
};

export default PostCard;

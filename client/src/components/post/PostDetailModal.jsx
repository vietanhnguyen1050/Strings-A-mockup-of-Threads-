/**
 * PostDetailModal Component
 * 
 * Opens when clicking on a post to show the full post with comments.
 * Compatible with backend field names.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Modal, 
  Avatar, 
  Typography, 
  Button, 
  Input, 
  Space, 
  Spin, 
  Divider,
  message,
  Image,
} from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  RetweetOutlined,
  ShareAltOutlined,
  CheckCircleFilled,
  SendOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/context/PostContext';
import { useTheme } from '@/context/ThemeContext';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

const PostDetailModal = ({ open, onClose, postId }) => {
  const { isAuthenticated, user } = useAuth();
  const { getPostById, addComment, likePost, repostPost } = usePosts();
  const { isDark } = useTheme();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && postId) {
      loadPost();
    }
  }, [open, postId]);

  const loadPost = async () => {
    setLoading(true);
    const result = await getPostById(postId);
    if (result.success) {
      setPost(result.data);
    }
    setLoading(false);
  };

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) return;
    if (!isAuthenticated) {
      message.warning('Please log in to comment');
      return;
    }

    setSubmitting(true);
    const result = await addComment(postId, commentContent.trim());
    if (result.success) {
      setCommentContent('');
      loadPost(); // Reload to get updated comments
      message.success('Comment posted');
    } else {
      message.error('Failed to post comment');
    }
    setSubmitting(false);
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      message.warning('Please log in to like posts');
      return;
    }
    await likePost(postId);
    loadPost();
  };

  const handleRepost = async () => {
    if (!isAuthenticated) {
      message.warning('Please log in to repost');
      return;
    }
    await repostPost(postId);
    loadPost();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatCount = (count) => {
    if (!count) return '0';
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return count.toString();
  };

  // Get author info (support both formats)
  const getAuthor = (item) => {
    const author = item?.author || item?.userId || {};
    return {
      username: author.username || '',
      displayName: author.displayName || author.username || '',
      avatar: author.avatar || author.avatarUrl || '',
      isVerified: author.isVerified || false,
    };
  };

  const userId = user?._id || user?.userId;
  const reactions = post?.reacts || post?.reactions || [];
  const reposts = post?.repostedBy || post?.reposts || [];
  const comments = post?.commentsList || post?.comments || [];
  
  const hasLiked = userId && reactions.some(id => id === userId || id?._id === userId);
  const hasReposted = userId && reposts.some(id => id === userId || id?._id === userId);

  const postAuthor = getAuthor(post);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      styles={{
        content: {
          background: isDark ? '#000' : '#fff',
          padding: 0,
        },
        mask: {
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      ) : post ? (
        <div style={{ maxHeight: '80vh', overflow: 'auto' }}>
          {/* Post */}
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to={`/${postAuthor.username}`} onClick={onClose}>
                <Avatar 
                  size={48} 
                  src={postAuthor.avatar}
                  style={{ backgroundColor: isDark ? '#333' : '#f0f0f0' }}
                >
                  {postAuthor.displayName?.charAt(0).toUpperCase()}
                </Avatar>
              </Link>

              <div style={{ flex: 1 }}>
                <Space>
                  <Link 
                    to={`/${postAuthor.username}`}
                    onClick={onClose}
                    style={{ 
                      fontWeight: 600, 
                      color: isDark ? '#fff' : '#000',
                      textDecoration: 'none',
                    }}
                  >
                    {postAuthor.displayName}
                  </Link>
                  {postAuthor.isVerified && (
                    <CheckCircleFilled style={{ color: '#1890ff', fontSize: 14 }} />
                  )}
                </Space>
                <div>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    @{postAuthor.username}
                  </Text>
                </div>
              </div>
            </div>

            <Paragraph
              style={{ 
                margin: '16px 0',
                fontSize: 16,
                color: isDark ? '#fff' : '#000',
                whiteSpace: 'pre-wrap',
              }}
            >
              {post.content}
            </Paragraph>

            {/* Media */}
            {post.media && post.media.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <Image.PreviewGroup>
                  <Space wrap>
                    {post.media.map((url, index) => (
                      <Image
                        key={index}
                        src={url}
                        width={250}
                        style={{ borderRadius: 12 }}
                      />
                    ))}
                  </Space>
                </Image.PreviewGroup>
              </div>
            )}

            <Text type="secondary" style={{ fontSize: 14 }}>
              {formatTime(post.createdAt)}
            </Text>

            <Divider style={{ margin: '16px 0' }} />

            {/* Stats */}
            <Space size="large">
              <Text>
                <strong>{formatCount(reactions.length)}</strong>{' '}
                <Text type="secondary">likes</Text>
              </Text>
              <Text>
                <strong>{formatCount(comments.length)}</strong>{' '}
                <Text type="secondary">comments</Text>
              </Text>
              <Text>
                <strong>{formatCount(reposts.length)}</strong>{' '}
                <Text type="secondary">reposts</Text>
              </Text>
            </Space>

            <Divider style={{ margin: '16px 0' }} />

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Button
                type="text"
                onClick={handleLike}
                style={{ color: hasLiked ? '#ff4d4f' : undefined }}
                icon={hasLiked ? <HeartFilled /> : <HeartOutlined />}
              >
                Like
              </Button>
              <Button
                type="text"
                icon={<MessageOutlined />}
                onClick={() => document.getElementById('comment-input')?.focus()}
              >
                Comment
              </Button>
              <Button
                type="text"
                onClick={handleRepost}
                style={{ color: hasReposted ? '#52c41a' : undefined }}
                icon={<RetweetOutlined />}
              >
                Repost
              </Button>
              <Button
                type="text"
                icon={<ShareAltOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/post/${post._id || post.postId}`);
                  message.success('Link copied');
                }}
              >
                Share
              </Button>
            </div>
          </div>

          <Divider style={{ margin: 0 }} />

          {/* Comment input */}
          {isAuthenticated && (
            <div style={{ padding: 16, display: 'flex', gap: 12 }}>
              <Avatar 
                size={40} 
                src={user?.avatar || user?.avatarUrl}
                style={{ backgroundColor: isDark ? '#333' : '#f0f0f0' }}
              >
                {user?.displayName?.charAt(0).toUpperCase()}
              </Avatar>
              <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                <TextArea
                  id="comment-input"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Write a comment..."
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  style={{ 
                    resize: 'none',
                    background: isDark ? '#262626' : '#f5f5f5',
                    border: 'none',
                  }}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSubmitComment}
                  loading={submitting}
                  disabled={!commentContent.trim()}
                />
              </div>
            </div>
          )}

          {/* Comments */}
          <div style={{ padding: '0 16px 16px' }}>
            {comments.length > 0 ? (
              comments.map((comment) => {
                const commentAuthor = getAuthor(comment);
                return (
                  <div 
                    key={comment._id || comment.postId} 
                    style={{ 
                      display: 'flex', 
                      gap: 12, 
                      padding: '12px 0',
                      borderBottom: `1px solid ${isDark ? '#262626' : '#f0f0f0'}`,
                    }}
                  >
                    <Link to={`/${commentAuthor.username}`} onClick={onClose}>
                      <Avatar 
                        size={36}
                        src={commentAuthor.avatar}
                        style={{ backgroundColor: isDark ? '#333' : '#f0f0f0' }}
                      >
                        {commentAuthor.displayName?.charAt(0).toUpperCase()}
                      </Avatar>
                    </Link>
                    <div>
                      <Space>
                        <Link 
                          to={`/${commentAuthor.username}`}
                          onClick={onClose}
                          style={{ 
                            fontWeight: 600, 
                            color: isDark ? '#fff' : '#000',
                            textDecoration: 'none',
                            fontSize: 14,
                          }}
                        >
                          {commentAuthor.username}
                        </Link>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {formatTime(comment.createdAt)}
                        </Text>
                      </Space>
                      <Paragraph style={{ margin: '4px 0 0 0', color: isDark ? '#fff' : '#000' }}>
                        {comment.content}
                      </Paragraph>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: 24, textAlign: 'center' }}>
                <Text type="secondary">No comments yet. Be the first to comment!</Text>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <Text type="secondary">Post not found</Text>
        </div>
      )}
    </Modal>
  );
};

export default PostDetailModal;

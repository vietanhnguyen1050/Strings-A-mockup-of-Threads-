import { useState } from 'react';
import { X, Image, AtSign } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/context/PostContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const CreatePostModal = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const { addPost } = usePosts();
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Login required",
        description: "Please log in to create posts",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Empty post",
        description: "Please write something to post",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addPost(content, user.id, user.username, user.displayName);
    setContent('');
    setIsPosting(false);
    onClose();
    
    toast({
      title: "Posted!",
      description: "Your thread has been published",
    });
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <p className="text-muted-foreground mb-4">
              You need to be logged in to create posts.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0">
        <DialogHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <button 
              onClick={onClose}
              className="p-1 hover:bg-muted rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <DialogTitle className="text-base font-semibold">New thread</DialogTitle>
            <div className="w-7" />
          </div>
        </DialogHeader>

        <div className="p-4">
          <div className="flex gap-3">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-muted text-muted-foreground">
                {user?.displayName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="font-semibold text-foreground">
                {user?.username}
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's new?"
                className="w-full mt-1 bg-transparent resize-none outline-none text-foreground placeholder:text-muted-foreground min-h-[100px]"
                autoFocus
              />
              
              <div className="flex items-center gap-2 mt-2">
                <button className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                  <Image size={20} />
                </button>
                <button className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                  <AtSign size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Anyone can reply
          </span>
          <Button 
            onClick={handlePost}
            disabled={!content.trim() || isPosting}
            className="rounded-full px-5"
          >
            {isPosting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;

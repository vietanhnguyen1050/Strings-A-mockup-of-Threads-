import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const CreatePostBox = ({ onClick }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div 
      onClick={onClick}
      className="px-4 py-3 border-b border-border cursor-pointer hover:bg-threads-hover/30 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="bg-muted text-muted-foreground">
            {user?.displayName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-muted-foreground flex-1">What's new?</span>
        <Button variant="outline" size="sm" className="rounded-full">
          Post
        </Button>
      </div>
    </div>
  );
};

export default CreatePostBox;

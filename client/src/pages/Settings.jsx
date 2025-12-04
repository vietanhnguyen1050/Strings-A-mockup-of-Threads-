import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Bell, 
  Lock, 
  Eye, 
  UserX, 
  MessageSquare, 
  Globe, 
  HelpCircle,
  Info,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-2">Login to access settings</h2>
          <p className="text-muted-foreground mb-4">
            You need to be logged in to view settings.
          </p>
          <Link 
            to="/login"
            className="inline-block px-6 py-2 bg-foreground text-background rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Log in
          </Link>
        </div>
      </div>
    );
  }

  const settingsGroups = [
    {
      title: 'Preferences',
      items: [
        { 
          icon: theme === 'dark' ? Moon : Sun, 
          label: 'Dark mode', 
          action: 'toggle',
          value: theme === 'dark',
          onToggle: toggleTheme
        },
        { icon: Bell, label: 'Notifications', action: 'link' },
        { icon: Lock, label: 'Privacy', action: 'link' },
      ],
    },
    {
      title: 'Account',
      items: [
        { icon: Eye, label: 'Hidden Words', action: 'link' },
        { icon: UserX, label: 'Blocked accounts', action: 'link' },
        { icon: MessageSquare, label: 'Mentions', action: 'link' },
      ],
    },
    {
      title: 'More info and support',
      items: [
        { icon: Globe, label: 'Language', action: 'link' },
        { icon: HelpCircle, label: 'Help', action: 'link' },
        { icon: Info, label: 'About', action: 'link' },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="py-4 px-4">
          <h1 className="text-xl font-bold text-center">Settings</h1>
        </div>
      </header>

      {/* Settings */}
      <div className="p-4 space-y-6">
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-sm font-medium text-muted-foreground mb-2 px-2">
              {group.title}
            </h2>
            <div className="bg-card rounded-xl overflow-hidden">
              {group.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between p-4 hover:bg-threads-hover transition-colors cursor-pointer ${
                      index !== group.items.length - 1 ? 'border-b border-border' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className="text-muted-foreground" />
                      <span className="text-foreground">{item.label}</span>
                    </div>
                    {item.action === 'toggle' ? (
                      <Switch 
                        checked={item.value} 
                        onCheckedChange={item.onToggle}
                      />
                    ) : (
                      <ChevronRight size={20} className="text-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;

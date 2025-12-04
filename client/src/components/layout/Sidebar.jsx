import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, Heart, User, Settings, Moon, Sun, LogOut, LogIn, ThumbsUp, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Sidebar = ({ onCreateClick }) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Search, path: '/search', label: 'Search' },
    { icon: PlusSquare, path: '#create', label: 'Create', onClick: onCreateClick },
    { icon: Heart, path: '/notifications', label: 'Notifications' },
    { icon: User, path: isAuthenticated && user ? `/${user.username}` : '/login', label: 'Profile' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[72px] flex flex-col items-center py-4 bg-background border-r border-border z-50">
      {/* Logo */}
      <Link to="/" className="mb-6 p-3 rounded-lg hover:bg-threads-hover transition-colors">
        <svg width="24" height="24" viewBox="0 0 192 192" fill="currentColor">
          <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3175 35.2355 52.0339 45.7381 38.683C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C120.004 17.1122 137.552 24.4548 149.217 38.7446C154.965 45.7909 159.346 54.6686 162.294 65.1282L179.017 60.6091C175.298 47.5014 169.555 36.4541 161.83 27.5765C146.672 10.0936 125.051 0.974819 97.0695 0.782568L96.9569 0.781982L96.8426 0.782568C68.8595 0.974819 47.2386 10.0936 32.0804 27.5765C18.3013 43.4424 11.2823 65.6512 11.0781 95.9999L11.0781 96.0008L11.0781 96.0024C11.2823 126.349 18.3013 148.558 32.0804 164.424C47.2386 181.906 68.8595 191.025 96.8426 191.218L96.9569 191.218L97.0695 191.218C122.03 191.033 140.021 184.485 154.096 170.428C173.605 150.939 172.927 126.135 166.826 111.875C162.244 101.291 153.474 92.7987 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.928 98.4405 129.507Z"/>
        </svg>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.path !== '#create' && isActive(item.path);
          
          if (item.onClick) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="p-4 rounded-lg hover:bg-threads-hover transition-all duration-200 group"
                title={item.label}
              >
                <Icon 
                  size={26} 
                  strokeWidth={1.5}
                  className="text-muted-foreground group-hover:text-foreground transition-colors"
                />
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`p-4 rounded-lg hover:bg-threads-hover transition-all duration-200 group ${
                active ? 'text-foreground' : ''
              }`}
              title={item.label}
            >
              <Icon 
                size={26} 
                strokeWidth={active ? 2 : 1.5}
                className={`transition-colors ${
                  active ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                }`}
              />
            </Link>
          );
        })}
      </nav>

      {/* Bottom Menu */}
      <div className="flex flex-col items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-4 rounded-lg hover:bg-threads-hover transition-colors">
              <Menu size={26} strokeWidth={1.5} className="text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="w-56 mb-2 ml-2">
            <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
              {theme === 'dark' ? (
                <>
                  <Sun size={18} className="mr-2" />
                  Switch to Light Mode
                </>
              ) : (
                <>
                  <Moon size={18} className="mr-2" />
                  Switch to Dark Mode
                </>
              )}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {isAuthenticated ? (
              <>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/liked">
                    <ThumbsUp size={18} className="mr-2" />
                    Liked Posts
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/settings">
                    <Settings size={18} className="mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                  <LogOut size={18} className="mr-2" />
                  Log out
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/login">
                    <LogIn size={18} className="mr-2" />
                    Log in
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/signup">
                    <User size={18} className="mr-2" />
                    Sign up
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};

export default Sidebar;

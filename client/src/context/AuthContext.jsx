import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('threads_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    // Simulated login - replace with actual API call
    const mockUser = {
      id: '1',
      username: 'demo_user',
      displayName: 'Demo User',
      avatar: '',
      bio: 'Welcome to Threads clone!',
      followers: 42,
      following: 128,
    };
    setUser(mockUser);
    localStorage.setItem('threads_user', JSON.stringify(mockUser));
    return true;
  };

  const signup = async (email, password, username, displayName) => {
    // Simulated signup - replace with actual API call
    const newUser = {
      id: Date.now().toString(),
      username,
      displayName,
      avatar: '',
      bio: '',
      followers: 0,
      following: 0,
    };
    setUser(newUser);
    localStorage.setItem('threads_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('threads_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

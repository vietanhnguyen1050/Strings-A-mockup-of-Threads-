/**
 * App.jsx - Main Application Component
 * 
 * Sets up Ant Design theming, React Router, and Context providers.
 * Includes protected routes for authenticated-only pages.
 */

import { ConfigProvider, theme, App as AntApp } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { PostProvider } from '@/context/PostContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import Notifications from '@/pages/Notifications';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Liked from '@/pages/Liked';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

// Redirect authenticated users away from login/signup
const AuthRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

// Inner component that uses theme context
const AppContent = () => {
  const { isDark } = useTheme();
  
  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        },
        components: {
          Button: {
            borderRadius: 8,
          },
          Input: {
            borderRadius: 8,
          },
          Modal: {
            borderRadiusLG: 16,
          },
        },
      }}
    >
      <AntApp>
        <BrowserRouter>
          <Routes>
            {/* Auth routes - redirect if already logged in */}
            <Route path="/login" element={
              <AuthRoute><Login /></AuthRoute>
            } />
            <Route path="/signup" element={
              <AuthRoute><Signup /></AuthRoute>
            } />
            
            {/* Main app routes with layout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/search/:searchParams" element={<Search />} />
              <Route path="/notifications" element={
                <ProtectedRoute><Notifications /></ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute><Settings /></ProtectedRoute>
              } />
              <Route path="/liked" element={
                <ProtectedRoute><Liked /></ProtectedRoute>
              } />
              <Route path="/:username" element={<Profile />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <PostProvider>
          <AppContent />
        </PostProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

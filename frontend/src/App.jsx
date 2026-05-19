import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { Toaster } from 'react-hot-toast';
import Spinner from './components/Spinner';

// Error Boundary Fallback component
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loading page layouts
import DashboardLayout from './layouts/DashboardLayout';

// Lazy loading pages for Code Splitting
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b13]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role verification check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b13]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationsProvider>
          <BrowserRouter>
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-[#070b13]">
                  <Spinner size="lg" />
                </div>
              }
            >
              <Routes>
                {/* Public Landing Page */}
                <Route
                  path="/"
                  element={
                    <PublicRoute>
                      <LandingPage />
                    </PublicRoute>
                  }
                />

                {/* Public Authentication Routes */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />
                {/* Signup Alias */}
                <Route
                  path="/signup"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />

                {/* Protected General Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <ProtectedRoute>
                      <Projects />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/:id"
                  element={
                    <ProtectedRoute>
                      <ProjectDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />

                {/* Role-Based Admin Guarded Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />

                {/* Redirect rules for index.html from static server/testing */}
                <Route
                  path="/static/index.html"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route
                  path="/index.html"
                  element={<Navigate to="/dashboard" replace />}
                />

                {/* 404 Fallback routing */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          
          {/* Toast Notifications Provider */}
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#0f172a',
                color: '#f3f4f6',
                border: '1px solid #1e293b',
                borderRadius: '12px'
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#0f172a',
                },
              },
            }}
          />
        </NotificationsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

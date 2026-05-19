import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationsContext';
import { 
  FiGrid, 
  FiFolder, 
  FiBarChart2, 
  FiUser, 
  FiSettings, 
  FiShield, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiBell, 
  FiCheckCircle,
  FiSun,
  FiMoon
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiGrid size={18} /> },
    { name: 'Projects', path: '/projects', icon: <FiFolder size={18} /> },
    { name: 'Analytics', path: '/analytics', icon: <FiBarChart2 size={18} /> },
    { name: 'Profile', path: '/profile', icon: <FiUser size={18} /> },
    { name: 'Settings', path: '/settings', icon: <FiSettings size={18} /> },
  ];

  if (isAdmin) {
    menuItems.push({ name: 'Admin Panel', path: '/admin', icon: <FiShield size={18} /> });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-bg-sidebar border-r border-border-color">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-border-color shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-brand-500/20 font-heading text-base shrink-0">
          T
        </div>
        <div className="min-w-0">
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-500 font-heading text-sm tracking-wider uppercase block truncate">
            TeamPro
          </span>
          <span className="block text-[9px] text-brand-500 font-bold tracking-wider -mt-0.5 uppercase truncate">
            Task Manager
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/dashboard' && location.pathname.startsWith(`${item.path}/`));
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-brand-500/10 text-brand-500 border border-brand-500/20 shadow-sm'
                  : 'text-text-muted hover:text-text-heading hover:bg-bg-surface/60 border border-transparent'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User info + logout at bottom */}
      <div className="p-3 border-t border-border-color bg-bg-main/30 shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center font-bold text-brand-500 font-heading text-sm shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-sm font-bold text-text-heading truncate">{user?.name}</span>
            <div className="flex items-center gap-1.5">
              <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${user?.role === 'Admin' ? 'bg-red-500' : 'bg-emerald-500'}`} />
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wide truncate">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 flex items-center gap-3 w-full px-3 py-2.5 text-text-muted hover:text-red-500 hover:bg-red-500/5 rounded-xl text-sm font-semibold border border-transparent transition duration-200"
        >
          <FiLogOut size={16} className="shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-bg-main text-text-main">
      {/* ─── Desktop Sidebar ─────────────────────────────────────── */}
      <aside className="hidden md:block w-64 fixed inset-y-0 left-0 z-20 shrink-0">
        <SidebarContent />
      </aside>

      {/* ─── Main Content ─────────────────────────────────────────── */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">

        {/* Top Navbar */}
        <header className="h-16 border-b border-border-color flex items-center justify-between px-4 md:px-6 bg-bg-main/90 backdrop-blur-md sticky top-0 z-30 gap-4">

          {/* Left: hamburger (mobile) + page title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-heading hover:bg-bg-surface border border-border-color transition shrink-0"
              aria-label="Open menu"
            >
              <FiMenu size={20} />
            </button>
            <span className="text-sm font-bold text-text-heading hidden sm:block truncate capitalize">
              {location.pathname.replace('/', '') || 'Dashboard'}
            </span>
          </div>

          {/* Right: theme toggle + notifications + user chip */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-text-muted hover:text-text-heading hover:bg-bg-surface border border-border-color transition"
              title="Toggle theme"
            >
              {darkMode
                ? <FiSun size={16} className="text-yellow-400" />
                : <FiMoon size={16} className="text-indigo-500" />
              }
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-lg text-text-muted hover:text-text-heading hover:bg-bg-surface border border-border-color transition relative"
                aria-label="Notifications"
              >
                <FiBell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-bg-main" />
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-72 sm:w-80 glass-panel rounded-xl shadow-2xl border border-border-color overflow-hidden z-50"
                    >
                      {/* Notif header */}
                      <div className="px-4 py-3 border-b border-border-color flex items-center justify-between">
                        <span className="font-bold text-sm text-text-heading">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-500/10 text-brand-500 rounded-full border border-brand-500/20">
                            {unreadCount} New
                          </span>
                        )}
                      </div>

                      {/* Notif list */}
                      <div className="max-h-64 overflow-y-auto divide-y divide-border-color">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-text-muted text-xs">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-3 text-xs flex items-start gap-2.5 transition duration-150 ${
                                !notif.isRead ? 'bg-brand-500/5' : 'opacity-60'
                              }`}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-text-main font-medium leading-relaxed">{notif.message}</p>
                                <span className="text-[10px] text-text-muted block mt-1">
                                  {new Date(notif.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              {!notif.isRead && (
                                <button
                                  onClick={() => markAsRead(notif.id)}
                                  className="text-brand-500 hover:text-brand-600 p-0.5 hover:bg-brand-500/10 rounded transition shrink-0"
                                  title="Mark as Read"
                                >
                                  <FiCheckCircle size={14} />
                                </button>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-border-color hidden sm:block" />

            {/* User chip */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 text-xs font-bold font-heading shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-text-heading hidden lg:block truncate max-w-[100px]">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* ─── Mobile Sidebar Drawer ────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="relative w-64 max-w-[80vw] flex flex-col z-50 shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-3 p-2 rounded-lg text-text-muted hover:text-text-heading hover:bg-bg-surface border border-border-color transition z-50"
                aria-label="Close menu"
              >
                <FiX size={18} />
              </button>
              <SidebarContent />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;

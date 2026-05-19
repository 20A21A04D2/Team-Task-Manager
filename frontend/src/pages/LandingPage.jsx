import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowRight, 
  FiCheck, 
  FiStar, 
  FiUsers, 
  FiLayers, 
  FiActivity, 
  FiLock, 
  FiBell, 
  FiCpu, 
  FiMenu, 
  FiX, 
  FiSun, 
  FiMoon,
  FiTrendingUp,
  FiCalendar,
  FiClock
} from 'react-icons/fi';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  // Track scrolling to toggle navbar background
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Scroll to section smoothly
  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-bg-main text-text-main font-sans selection:bg-brand-500 selection:text-white overflow-hidden transition-colors duration-300">
      {/* Background Blobs for Visual Sparkle */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none dark:bg-brand-600/5" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none dark:bg-indigo-500/5" />
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none dark:bg-emerald-500/5" />

      {/* 1️⃣ Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass-panel py-4 border-b border-border-color shadow-lg shadow-black/5' 
          : 'py-6 bg-transparent border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-brand-500/20 font-heading text-xl">
              T
            </div>
            <div>
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-text-heading to-text-main font-heading text-lg tracking-wider uppercase">
                TeamPro
              </span>
              <span className="block text-[10px] text-brand-400 font-bold tracking-wider -mt-1 uppercase">
                Task Manager
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 font-semibold text-sm">
            {['features', 'analytics', 'workflow', 'testimonials', 'pricing'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="text-text-muted hover:text-brand-500 transition capitalize cursor-pointer"
              >
                {section}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-border-color text-text-muted hover:text-text-heading hover:bg-bg-surface/85 transition"
              title="Toggle theme"
            >
              {darkMode ? <FiSun size={18} className="text-yellow-400 animate-pulse" /> : <FiMoon size={18} className="text-indigo-500" />}
            </button>

            <Link
              to="/login"
              className="text-text-muted hover:text-text-heading font-semibold text-sm px-4 py-2 transition"
            >
              Sign In
            </Link>
            
            <Link
              to="/register"
              className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition transform hover:-translate-y-0.5 duration-200"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Hamburguer and Theme Trigger */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-border-color text-text-muted hover:text-text-heading transition"
            >
              {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-text-muted hover:text-text-heading hover:bg-bg-surface/80 border border-border-color transition"
            >
              {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="relative w-64 max-w-sm ml-auto bg-bg-sidebar border-l border-border-color flex flex-col h-full z-50 p-6 pt-24"
            >
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-lg text-text-muted hover:text-text-heading border border-border-color"
              >
                <FiX size={20} />
              </button>

              <div className="flex flex-col gap-6 font-bold text-lg">
                {['features', 'analytics', 'workflow', 'testimonials', 'pricing'].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className="text-left text-text-muted hover:text-brand-500 capitalize"
                  >
                    {section}
                  </button>
                ))}
                
                <div className="w-full h-px bg-border-color my-4" />

                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-text-muted hover:text-text-heading py-2"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-3 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2️⃣ Hero Section */}
      <section id="hero" className="relative pt-28 pb-16 md:pt-40 md:pb-32 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 md:gap-16">
        <div className="flex-1 space-y-8 text-center lg:text-left z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider border border-brand-500/20"
          >
            <FiActivity size={14} className="animate-pulse" />
            Empowering Modern Productive Teams
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading tracking-tight leading-tight text-text-heading"
          >
            Manage Teams & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-600 dark:from-brand-400 dark:via-indigo-400 dark:to-purple-500">
              Tasks Smarter
            </span> Than Ever
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-text-muted font-medium max-w-2xl leading-relaxed mx-auto lg:mx-0"
          >
            Streamline projects, assign tasks, track productivity, and collaborate efficiently with an enterprise-grade task management platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-600 to-indigo-650 hover:from-brand-500 hover:to-indigo-550 text-white font-bold rounded-xl shadow-xl shadow-brand-500/20 hover:shadow-brand-500/35 transition transform hover:-translate-y-0.5 duration-200 flex items-center justify-center gap-2 group"
            >
              Get Started Free
              <FiArrowRight size={18} className="group-hover:translate-x-1 transition duration-200" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-bg-surface hover:bg-bg-main text-text-heading border border-border-color font-bold rounded-xl shadow-lg transition duration-200 text-center"
            >
              Live Demo
            </Link>
          </motion.div>

          {/* Quick Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-8 border-t border-border-color/60 flex flex-wrap items-center justify-center lg:justify-start gap-8 md:gap-12"
          >
            <div>
              <span className="block text-3xl font-extrabold text-text-heading font-heading">99.8%</span>
              <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">Uptime SLA</span>
            </div>
            <div>
              <span className="block text-3xl font-extrabold text-text-heading font-heading">15k+</span>
              <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">Teams Registered</span>
            </div>
            <div>
              <span className="block text-3xl font-extrabold text-text-heading font-heading">4.9/5</span>
              <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">User Satisfaction</span>
            </div>
          </motion.div>
        </div>

        {/* Right side Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 w-full relative group"
        >
          {/* Glass Card Wrapper with floating stats */}
          <div className="relative glass-panel rounded-2xl border border-border-color shadow-2xl overflow-hidden p-3 bg-bg-surface/20">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/10 to-indigo-500/10 opacity-30 pointer-events-none" />
            
            {/* Topbar of Mockup */}
            <div className="flex items-center justify-between border-b border-border-color/40 pb-3 px-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
              </div>
              <div className="h-5 px-6 rounded-md bg-bg-main/50 border border-border-color/20 text-[10px] text-text-muted flex items-center justify-center font-mono">
                teampro.app/dashboard
              </div>
              <div className="w-5" />
            </div>

            {/* Content Mockup */}
            <div className="pt-3 grid grid-cols-3 gap-3">
              {/* Sidebar Mockup */}
              <div className="space-y-2 border-r border-border-color/30 pr-3">
                <div className="h-6 w-full rounded-md bg-brand-500/10 border border-brand-500/15" />
                <div className="h-5 w-4/5 rounded-md bg-bg-main/60" />
                <div className="h-5 w-5/6 rounded-md bg-bg-main/60" />
                <div className="h-5 w-3/4 rounded-md bg-bg-main/60" />
                <div className="h-12 w-full rounded-md bg-bg-main/30 border border-border-color/20 mt-12" />
              </div>

              {/* Main Area Mockup */}
              <div className="col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-1/3 rounded-md bg-text-heading/10" />
                  <div className="h-5 w-12 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" />
                </div>
                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-bg-surface/50 border border-border-color/30 space-y-1">
                    <span className="block text-[8px] sm:text-[10px] text-text-muted uppercase">Pending</span>
                    <span className="block text-base sm:text-lg font-bold text-text-heading font-heading">14</span>
                  </div>
                  <div className="p-2 rounded-lg bg-bg-surface/50 border border-border-color/30 space-y-1">
                    <span className="block text-[8px] sm:text-[10px] text-text-muted uppercase">Completed</span>
                    <span className="block text-base sm:text-lg font-bold text-text-heading font-heading">89%</span>
                  </div>
                </div>
                {/* Chart Mockup */}
                <div className="h-28 rounded-lg bg-bg-surface/75 border border-border-color/40 p-2 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-[10px] text-text-muted">
                    <span>Performance</span>
                    <FiTrendingUp className="text-emerald-500" />
                  </div>
                  <div className="flex items-end justify-between h-16 gap-1 px-1">
                    <div className="w-full h-8 bg-brand-500/20 border border-brand-500/30 rounded-sm" />
                    <div className="w-full h-12 bg-indigo-500/20 border border-indigo-500/30 rounded-sm" />
                    <div className="w-full h-10 bg-brand-500/30 border border-brand-500/40 rounded-sm" />
                    <div className="w-full h-14 bg-indigo-500/30 border border-indigo-500/40 rounded-sm" />
                    <div className="w-full h-16 bg-brand-500/60 border border-brand-500/70 rounded-sm animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating UI cards */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-[-30px] right-[-20px] glass-panel rounded-xl border border-border-color p-3 shadow-xl flex items-center gap-3 bg-bg-surface/90"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <span className="block text-xs font-bold text-text-heading">Task Completed</span>
              <span className="text-[10px] text-text-muted">Deploy v1.2 Release</span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 4, delay: 1, ease: "easeInOut" }}
            className="absolute bottom-[-15px] left-[-20px] glass-panel rounded-xl border border-border-color p-3 shadow-xl flex items-center gap-3 bg-bg-surface/90"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <FiUsers size={16} />
            </div>
            <div>
              <span className="block text-xs font-bold text-text-heading">New Assignee</span>
              <span className="text-[10px] text-text-muted">Added Alex to frontend</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 📊 FEATURES SECTION */}
      <section id="features" className="py-16 md:py-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-sm font-extrabold text-brand-500 uppercase tracking-widest">Enterprise Features</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold font-heading text-text-heading">
            Everything You Need To Build High-Performance Teams
          </h3>
          <p className="text-text-muted font-medium leading-relaxed">
            Collaborate, allocate resources, and hit deadlines on time with features tailored for developers and product leads.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <FiUsers className="text-brand-500" size={24} />,
              title: "Team Collaboration",
              desc: "Coordinate with your team members in workspace threads, manage individual tasks, and track activity instantly."
            },
            {
              icon: <FiLayers className="text-indigo-500" size={24} />,
              title: "Task Tracking",
              desc: "Beautiful kanban boards, list views, and task priority matrixes to monitor project backlogs and sprint cycles."
            },
            {
              icon: <FiActivity className="text-purple-500" size={24} />,
              title: "Analytics Dashboard",
              desc: "Deep analytics profiling team workload balances, project completeness, and pending/completed bottlenecks."
            },
            {
              icon: <FiLock className="text-emerald-500" size={24} />,
              title: "Role-Based Access",
              desc: "Control workspaces using granular Admin and Team Member permissions to secure corporate project assets."
            },
            {
              icon: <FiBell className="text-amber-500" size={24} />,
              title: "Real-Time Notifications",
              desc: "Stay notified in real time with system alerts and updates when actions occur across the workspace."
            },
            {
              icon: <FiCpu className="text-rose-500" size={24} />,
              title: "Project Management",
              desc: "Group related tasks under unique project spaces with specific deadlines, priority levels, and member pools."
            }
          ].map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-panel p-8 rounded-2xl border border-border-color shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col items-start gap-4 hover:border-brand-500/30 group"
            >
              <div className="w-12 h-12 rounded-xl bg-bg-main border border-border-color flex items-center justify-center shadow-md group-hover:scale-110 transition duration-200">
                {feat.icon}
              </div>
              <h4 className="text-lg font-bold text-text-heading font-heading">{feat.title}</h4>
              <p className="text-text-muted text-sm font-medium leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 📈 ANALYTICS PREVIEW SECTION */}
      <section id="analytics" className="py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-bg-sidebar/30 border-y border-border-color/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-sm font-extrabold text-indigo-500 uppercase tracking-widest">Real-time Metrics</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold font-heading text-text-heading">
                Turn Team Productivity Into Clear, Visible Progress
              </h3>
              <p className="text-text-muted font-medium leading-relaxed">
                Visualize performance, spot potential task blockers before they happen, and monitor high-level completion statistics directly from a modern, unified control center.
              </p>
            </div>

            {/* List items */}
            <div className="space-y-4 font-semibold text-sm">
              {[
                "Task completion velocity tracking (burn-down progress)",
                "Individual team workload and task load balancing",
                "Historical project analytics and deadline prediction algorithms"
              ].map((text) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                    <FiCheck size={14} />
                  </div>
                  <span className="text-text-heading">{text}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => scrollToSection('pricing')} 
              className="px-6 py-3 bg-bg-surface hover:bg-bg-main text-text-heading border border-border-color font-bold rounded-xl shadow-lg transition duration-200"
            >
              Learn More
            </button>
          </div>

          {/* Right Dashboard Visual */}
          <div className="glass-panel p-6 rounded-2xl border border-border-color shadow-2xl relative bg-bg-surface/40">
            <h4 className="text-md font-bold text-text-heading font-heading mb-4 flex items-center justify-between border-b border-border-color/30 pb-3">
              <span>SaaS Workspace Report</span>
              <span className="text-xs text-brand-500 font-bold uppercase">Updated live</span>
            </h4>

            <div className="space-y-6">
              {/* Metric Bar list */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-text-heading mb-1.5">
                    <span>Task Completion Rate</span>
                    <span className="text-indigo-500">84%</span>
                  </div>
                  <div className="h-2.5 w-full bg-bg-main border border-border-color/40 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-brand-500 rounded-full" style={{ width: '84%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-text-heading mb-1.5">
                    <span>Sprint Uptime and Deadlines Met</span>
                    <span className="text-emerald-500">92%</span>
                  </div>
                  <div className="h-2.5 w-full bg-bg-main border border-border-color/40 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-text-heading mb-1.5">
                    <span>Team Load Balancer</span>
                    <span className="text-amber-500">71%</span>
                  </div>
                  <div className="h-2.5 w-full bg-bg-main border border-border-color/40 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: '71%' }} />
                  </div>
                </div>
              </div>

              {/* Priority matrix grid preview */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-bg-surface/50 border border-border-color/30 rounded-xl text-center">
                  <span className="block text-[10px] text-text-muted uppercase font-bold">Todo</span>
                  <span className="block text-2xl font-extrabold text-brand-500 font-heading">12</span>
                </div>
                <div className="p-3 bg-bg-surface/50 border border-border-color/30 rounded-xl text-center">
                  <span className="block text-[10px] text-text-muted uppercase font-bold">Progress</span>
                  <span className="block text-2xl font-extrabold text-indigo-500 font-heading">5</span>
                </div>
                <div className="p-3 bg-bg-surface/50 border border-border-color/30 rounded-xl text-center">
                  <span className="block text-[10px] text-text-muted uppercase font-bold">Done</span>
                  <span className="block text-2xl font-extrabold text-emerald-500 font-heading">48</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⚡ WORKFLOW SECTION */}
      <section id="workflow" className="py-16 md:py-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-sm font-extrabold text-brand-500 uppercase tracking-widest">How It Works</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold font-heading text-text-heading">
            Streamlined Setup In 4 Simple Steps
          </h3>
          <p className="text-text-muted font-medium leading-relaxed">
            Get your team on the same page and start collaborating efficiently in under five minutes.
          </p>
        </div>

        {/* Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {[
            {
              step: "01",
              title: "Create Project",
              desc: "Set up project hubs with unique names, descriptions, deadlines, and high-level priorities.",
              icon: <FiLayers size={18} />
            },
            {
              step: "02",
              title: "Add Team Members",
              desc: "Invite members to workspaces with unique permissions, emails, and roles (Admin/Member).",
              icon: <FiUsers size={18} />
            },
            {
              step: "03",
              title: "Assign Tasks",
              desc: "Map backlogs, set specific priorities (High/Medium/Low), and bind tasks to team members.",
              icon: <FiCheck size={18} />
            },
            {
              step: "04",
              title: "Track Progress",
              desc: "Analyze task burn-down, complete items, receive system alerts, and measure progress metrics.",
              icon: <FiActivity size={18} />
            }
          ].map((item, i) => (
            <div key={item.step} className="relative flex flex-col items-start gap-4">
              
              {/* Connector line for large screen */}
              {i < 3 && (
                <div className="hidden lg:block absolute top-7 left-14 w-full h-[1px] bg-border-color border-dashed border-t border-border-color z-0" />
              )}

              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center font-bold shadow-lg shadow-brand-500/20 font-heading z-10">
                {item.icon}
                <span className="absolute -top-3 -right-3 text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-bg-surface border border-border-color text-brand-500 uppercase">
                  {item.step}
                </span>
              </div>

              <div className="space-y-2 mt-2">
                <h4 className="text-lg font-bold text-text-heading font-heading">{item.title}</h4>
                <p className="text-text-muted text-sm font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🌟 TESTIMONIAL SECTION */}
      <section id="testimonials" className="py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-bg-sidebar/30 border-y border-border-color/60">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-sm font-extrabold text-indigo-500 uppercase tracking-widest">User Feedback</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold font-heading text-text-heading">
              Loved By Teams Operating Around The Globe
            </h3>
            <p className="text-text-muted font-medium leading-relaxed">
              Discover how design teams, startups, and software engineering agencies use TeamPro to streamline delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Jenkins",
                role: "Director of Engineering at NextGen",
                review: "Integrating TeamPro completely altered our deployment velocity. The task assignments are intuitive, the real-time notifications are lightning-fast, and the charts give me instant clarity on project status.",
                stars: 5,
                initial: "S"
              },
              {
                name: "David Kim",
                role: "Co-Founder of AlphaTech",
                review: "The design aesthetics of this tool are mind-blowing. It looks like a premium software startup asset, and the UX flows are incredibly smooth. Light/dark switching is beautiful.",
                stars: 5,
                initial: "D"
              },
              {
                name: "Marcus Vance",
                role: "Product Manager at FlowState Studio",
                review: "Role-based authorization limits let us bring client reviewers on board as Team Members while leaving administrative tasks protected for our internal scrum masters.",
                stars: 5,
                initial: "M"
              }
            ].map((testi) => (
              <div 
                key={testi.name}
                className="glass-panel p-8 rounded-2xl border border-border-color shadow-lg flex flex-col justify-between gap-6 hover:scale-[1.01] transition duration-200 bg-bg-surface/50"
              >
                <div className="space-y-4">
                  {/* Stars */}
                  <div className="flex gap-1 text-yellow-400">
                    {[...Array(testi.stars)].map((_, i) => (
                      <FiStar key={i} size={14} className="fill-current" />
                    ))}
                  </div>
                  <p className="text-text-muted text-sm font-medium leading-relaxed italic">
                    "{testi.review}"
                  </p>
                </div>

                <div className="flex items-center gap-3.5 border-t border-border-color/30 pt-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold font-heading">
                    {testi.initial}
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-text-heading leading-none mb-1">{testi.name}</span>
                    <span className="text-[10px] text-text-muted font-semibold uppercase">{testi.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 💳 PRICING SECTION */}
      <section id="pricing" className="py-16 md:py-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-sm font-extrabold text-brand-500 uppercase tracking-widest">Simple Pricing</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold font-heading text-text-heading">
            Flexible Plans For Growing Workspaces
          </h3>
          <p className="text-text-muted font-medium leading-relaxed">
            Choose a plan that matches your workspace requirements. No hidden fees. Cancel at any time.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Free Plan */}
          <div className="glass-panel p-8 rounded-2xl border border-border-color shadow-lg flex flex-col justify-between gap-8 bg-bg-surface/40">
            <div className="space-y-4">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Free Starter</span>
              <h4 className="text-4xl font-extrabold text-text-heading font-heading">$0</h4>
              <p className="text-text-muted text-xs font-medium leading-relaxed">
                Perfect for individuals and small team test setups.
              </p>
              <div className="w-full h-px bg-border-color/40 my-2" />
              <ul className="space-y-2.5 text-sm font-semibold">
                {["Up to 5 Users", "2 Active Projects", "Granular Task Logs", "Email Alerts"].map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <FiCheck size={16} className="text-brand-500 shrink-0" />
                    <span className="text-text-muted">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/register"
              className="block w-full py-3 text-center text-text-heading border border-border-color hover:bg-bg-main font-bold rounded-xl transition duration-200"
            >
              Sign Up Free
            </Link>
          </div>

          {/* Pro Plan (Highlighted) */}
          <div className="glass-panel p-8 rounded-2xl border-2 border-brand-500 shadow-xl flex flex-col justify-between gap-8 bg-bg-surface/80 relative scale-100 lg:scale-[1.03] z-10 shadow-brand-500/10">
            <span className="absolute -top-3.5 right-6 px-3 py-1 text-[10px] font-extrabold bg-brand-500 text-white rounded-full uppercase tracking-wider">
              Most Popular
            </span>
            <div className="space-y-4">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Professional</span>
              <h4 className="text-4xl font-extrabold text-text-heading font-heading">$12<span className="text-xs text-text-muted font-normal"> / user / mo</span></h4>
              <p className="text-text-muted text-xs font-medium leading-relaxed">
                Unlock collaborative power for scaling agencies and active companies.
              </p>
              <div className="w-full h-px bg-border-color/40 my-2" />
              <ul className="space-y-2.5 text-sm font-semibold">
                {[
                  "Unlimited Users",
                  "Unlimited Active Projects",
                  "Advanced Analytics Boards",
                  "Granular Role Authorization",
                  "Priority Email Support"
                ].map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <FiCheck size={16} className="text-brand-500 shrink-0" />
                    <span className="text-text-heading">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/register"
              className="block w-full py-3.5 text-center bg-gradient-to-r from-brand-600 to-indigo-650 text-white font-bold rounded-xl hover:from-brand-500 hover:to-indigo-550 shadow-lg shadow-brand-500/25 transition duration-200"
            >
              Get Started Now
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="glass-panel p-8 rounded-2xl border border-border-color shadow-lg flex flex-col justify-between gap-8 bg-bg-surface/40">
            <div className="space-y-4">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Enterprise Custom</span>
              <h4 className="text-4xl font-extrabold text-text-heading font-heading">Custom</h4>
              <p className="text-text-muted text-xs font-medium leading-relaxed">
                Dedicated servers, custom integrations, and SLA guarantees for scaling structures.
              </p>
              <div className="w-full h-px bg-border-color/40 my-2" />
              <ul className="space-y-2.5 text-sm font-semibold">
                {[
                  "Dedicated Private Instances",
                  "Active Directory SSO Support",
                  "Custom SLA Up to 99.99%",
                  "24/7 Phone & Zoom Support",
                  "API Integrations Support"
                ].map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <FiCheck size={16} className="text-brand-500 shrink-0" />
                    <span className="text-text-muted">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/register"
              className="block w-full py-3 text-center text-text-heading border border-border-color hover:bg-bg-main font-bold rounded-xl transition duration-200"
            >
              Contact Sales
            </Link>
          </div>

        </div>
      </section>

      {/* 📞 CTA SECTION */}
      <section className="py-24 px-6 md:px-8 max-w-5xl mx-auto text-center z-10 relative">
        <div className="glass-panel p-12 md:p-16 rounded-3xl border border-border-color shadow-2xl relative overflow-hidden bg-bg-surface/50">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/10 via-indigo-650/10 to-transparent pointer-events-none" />
          
          <div className="space-y-8 relative z-10 max-w-2xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight leading-tight text-text-heading">
              Start Managing Projects Like a Pro
            </h3>
            <p className="text-text-muted font-medium text-sm sm:text-md leading-relaxed">
              Unify task boards, manage role permissions, and sync performance analytics across your entire developer roster in real time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-600 to-indigo-650 hover:from-brand-500 hover:to-indigo-550 text-white font-bold rounded-xl shadow-xl shadow-brand-500/25 hover:shadow-brand-500/35 transition duration-200"
              >
                Start Free Trial
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-bg-surface hover:bg-bg-main border border-border-color font-bold rounded-xl transition duration-200 text-text-heading shadow-md"
              >
                Book Live Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🦶 FOOTER SECTION */}
      <footer className="border-t border-border-color bg-bg-sidebar/50 py-16 px-6 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
          
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg">
                T
              </div>
              <span className="font-extrabold font-heading text-text-heading tracking-wider uppercase">
                TeamPro
              </span>
            </div>
            <p className="text-text-muted text-xs leading-relaxed font-semibold">
              Streamlining tasks, planning projects, and accelerating startup velocities globally.
            </p>
          </div>

          {/* Links 1 */}
          <div className="space-y-4">
            <span className="block text-xs font-extrabold uppercase text-text-heading tracking-wider">Product</span>
            <div className="flex flex-col gap-2.5 text-xs font-bold text-text-muted">
              {['Features', 'Analytics', 'Pricing', 'Releases'].map((item) => (
                <button key={item} onClick={() => scrollToSection('features')} className="text-left hover:text-brand-500 transition cursor-pointer">{item}</button>
              ))}
            </div>
          </div>

          {/* Links 2 */}
          <div className="space-y-4">
            <span className="block text-xs font-extrabold uppercase text-text-heading tracking-wider">Company</span>
            <div className="flex flex-col gap-2.5 text-xs font-bold text-text-muted">
              {['About', 'Careers', 'Blog', 'Contact'].map((item) => (
                <button key={item} onClick={() => scrollToSection('testimonials')} className="text-left hover:text-brand-500 transition cursor-pointer">{item}</button>
              ))}
            </div>
          </div>

          {/* Legal / Socials */}
          <div className="space-y-4">
            <span className="block text-xs font-extrabold uppercase text-text-heading tracking-wider">Security & SLA</span>
            <p className="text-text-muted text-xs font-semibold leading-relaxed">
              GDPR-ready databases, SSO configurations, and audited database vaults.
            </p>
            <div className="text-[10px] text-text-muted font-bold">
              © {new Date().getFullYear()} TeamPro Inc. All rights reserved.
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

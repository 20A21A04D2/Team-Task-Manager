import React, { useState } from 'react';
import Button from '../components/Button';
import { toast } from 'react-hot-toast';
import { FiSun, FiMoon, FiBell, FiShield, FiSliders } from 'react-icons/fi';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [notifSound, setNotifSound] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleThemeToggle = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    toast.success(`Theme mode altered to ${nextMode ? 'Dark' : 'Light'}`);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Workspace preferences updated');
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-text-heading font-heading tracking-tight">System Settings</h1>
        <p className="text-sm text-text-muted font-medium">Configure display properties, alert options, and custom workflows.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="glass-panel p-6 rounded-xl border border-border-color shadow-xl space-y-6">
        {/* Theme Settings */}
        <div className="space-y-4">
          <h3 className="text-md font-bold text-text-heading font-heading flex items-center gap-2 border-b border-border-color pb-3">
            <FiSliders size={18} className="text-brand-400" />
            Appearance Properties
          </h3>
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="block text-sm font-semibold text-text-heading">Dark Mode Interface</span>
              <p className="text-xs text-text-muted">Toggle dark vs light glassmorphic backdrop assets.</p>
            </div>
            <button
              type="button"
              onClick={handleThemeToggle}
              className="p-2 rounded-lg border border-border-color text-text-muted hover:text-text-heading hover:bg-bg-main/80 transition flex items-center gap-2"
            >
              {darkMode ? <FiMoon size={18} className="text-indigo-400" /> : <FiSun size={18} className="text-yellow-400" />}
              <span className="text-xs font-semibold">{darkMode ? 'Dark theme' : 'Light theme'}</span>
            </button>
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="space-y-4">
          <h3 className="text-md font-bold text-text-heading font-heading flex items-center gap-2 border-b border-border-color pb-3">
            <FiBell size={18} className="text-brand-400" />
            Email & System Notifications
          </h3>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer py-1.5">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={() => setEmailAlerts(!emailAlerts)}
                className="mt-1 rounded bg-bg-main border-border-color text-brand-500 focus:ring-brand-500"
              />
              <div>
                <span className="block text-sm font-semibold text-text-main">Email task assignments</span>
                <p className="text-xs text-text-muted">Sends alerts when a user assigns a task to you.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer py-1.5">
              <input
                type="checkbox"
                checked={notifSound}
                onChange={() => setNotifSound(!notifSound)}
                className="mt-1 rounded bg-bg-main border-border-color text-brand-500 focus:ring-brand-500"
              />
              <div>
                <span className="block text-sm font-semibold text-text-main">Play notification sounds</span>
                <p className="text-xs text-text-muted">Audio feedback triggers on new alerts.</p>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-2 border-t border-border-color flex justify-end">
          <Button type="submit" variant="primary" loading={saving}>
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;

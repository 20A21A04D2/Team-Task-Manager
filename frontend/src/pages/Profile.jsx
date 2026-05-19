import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { toast } from 'react-hot-toast';
import { FiUser, FiMail, FiShield, FiLock } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    // Mock profile updates or endpoint call
    setTimeout(() => {
      setUpdating(false);
      toast.success('Profile details updated successfully');
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-text-heading font-heading tracking-tight">Account Profile</h1>
        <p className="text-sm text-text-muted font-medium">Update your account name, contact details, or secure credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl border border-border-color text-center flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-bg-surface border-2 border-brand-500 flex items-center justify-center text-3xl font-bold text-brand-500 font-heading mb-4">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-lg font-bold text-text-heading">{user?.name}</h3>
          <span className="px-3 py-1 bg-brand-500/10 text-brand-500 border border-brand-500/20 rounded-full text-xs font-bold uppercase mt-2">
            {user?.role}
          </span>
        </div>

        <form onSubmit={handleUpdateProfile} className="glass-panel p-6 rounded-xl border border-border-color md:col-span-2 space-y-5">
          <h4 className="text-md font-bold text-text-heading font-heading border-b border-border-color pb-3 mb-2">Profile Details</h4>
          
          <div className="space-y-4">
            <Input 
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input 
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
              className="bg-bg-main cursor-not-allowed opacity-60"
            />

            <Input 
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" loading={updating}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
